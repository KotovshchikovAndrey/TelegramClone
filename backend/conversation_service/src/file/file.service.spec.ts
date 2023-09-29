import { Test, TestingModule } from "@nestjs/testing"
import { LocalFileService } from "./file.service"
import { Hash, createHash, randomUUID } from "crypto"
import * as fs from "fs"

class AdmZipMock {
  constructor() {}

  addFile(filename: string, content: string) {
    return null
  }

  writeZip(zipPath: string) {
    return null
  }
}

jest.mock("adm-zip", () => jest.fn(() => new AdmZipMock()))
jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
  createHash: jest.fn(),
}))

const createHashMock = createHash as jest.MockedFunction<typeof createHash>
const randomUUIDMock = randomUUID as jest.MockedFunction<typeof randomUUID>

const existsSyncMock = jest.spyOn(fs, "existsSync")
const writeFileMock = jest.spyOn(fs.promises, "writeFile")
const unlickMock = jest.spyOn(fs.promises, "unlink")

describe("LocalFileService", () => {
  let localFleService: LocalFileService
  beforeEach(() => {
    localFleService = new LocalFileService()
  })

  // Check is upload work correct
  describe("uploadMedia", () => {
    it("should return uploaded file path", async () => {
      const file = {
        filename: "file",
        content: Buffer.from("content", "utf-8"),
        ext: "png",
        mimetype: "image/png",
      }

      writeFileMock.mockReturnValue(null)
      createHashMock.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnThis(),
        toString: jest.fn(() => `${file.filename}Hash`),
      } as unknown as Hash)

      const expectedResult = `${file.filename}Hash.${file.ext}`
      expect(await localFleService.uploadMedia(file)).toBe(expectedResult)
    })
  })

  // Check is multiple upload work correct
  describe("uploadMultipleMedia", () => {
    it("should return upload media path", async () => {
      const file1 = {
        filename: "file1",
        content: Buffer.from("content", "utf-8"),
        ext: "png",
        mimetype: "image/png",
      }

      const file2 = {
        filename: "file2",
        content: Buffer.from("content", "utf-8"),
        ext: "png",
        mimetype: "image/png",
      }

      writeFileMock.mockReturnValue(null)
      randomUUIDMock.mockReturnValue("uuid-uuid-uuid-uuid-uuid")
      createHashMock.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnThis(),
        toString: jest.fn(() => `zipHash`),
      } as unknown as Hash)

      const expectedResult = `zipHash_uuid-uuid-uuid-uuid-uuid.zip`
      expect(await localFleService.uploadMultipleMedia([file1, file2])).toBe(
        expectedResult,
      )
    })
  })

  // Check is multiple upload throw Error when files very big or have not allowed ext
  describe("uploadNotValidMultipleMedia", () => {
    it("shoult throw error", async () => {
      const bigStringSymbols = []
      for (let i = 0; i < 15728641; i++) bigStringSymbols.push("A")
      const bigString = bigStringSymbols.join("")

      const bigFile = {
        filename: "bigFile",
        content: Buffer.from(bigString, "utf-8"),
        ext: "png",
        mimetype: "image/png",
      }

      writeFileMock.mockReturnValue(null)

      await expect(
        localFleService.uploadMultipleMedia([bigFile]),
      ).rejects.toThrow(Error)

      const fileWithNotAllowedExt = {
        filename: "file",
        content: Buffer.from(bigString, "utf-8"),
        ext: "gif",
        mimetype: "image/gif",
      }

      await expect(
        localFleService.uploadMultipleMedia([fileWithNotAllowedExt]),
      ).rejects.toThrow(Error)
    })
  })

  // Check is upload method cached exists file and not write this again
  describe("uploadMediaCache", () => {
    it("should return exists file hash", async () => {
      const file = {
        filename: "file",
        content: Buffer.from("content", "utf-8"),
        ext: "png",
        mimetype: "image/png",
      }

      existsSyncMock.mockReturnValue(true)
      createHashMock.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnThis(),
        toString: jest.fn(() => `existsFileHash`),
      } as unknown as Hash)

      writeFileMock
        .mockImplementationOnce(() => {
          throw Error("uploadMediaCache test fail!")
        })
        .mockReset()

      const expectedResult = "existsFileHash.png"
      expect(await localFleService.uploadMedia(file)).toBe(expectedResult)
    })
  })

  // Check is multiple upload method cached exists files and not write this again
  describe("updateMultipleMediaCache", () => {
    it("should return exists media path", async () => {
      randomUUIDMock.mockReturnValue("uuid-uuid-uuid-uuid-uuid")
      createHashMock.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnThis(),
        toString: jest.fn(() => `oldFilesHash`),
      } as unknown as Hash)

      unlickMock
        .mockImplementationOnce(() => {
          throw Error("updateMultipleMediaCache test fail!")
        })
        .mockReset()

      const expectedResult = "oldFilesHash_uuid-uuid-uuid-uuid-uuid.zip"
      expect(
        await localFleService.updateMultipleMedia(
          "oldFilesHash_uuid-uuid-uuid-uuid-uuid.zip",
          [
            {
              filename: "file",
              content: Buffer.from("content", "utf-8"),
              ext: "png",
              mimetype: "image/png",
            },
          ],
        ),
      ).toBe(expectedResult)
    })
  })

  // Check is multiple update work correct
  describe("updateMultipleMedia", () => {
    it("should return new media path", async () => {
      unlickMock.mockReturnValue(null)
      writeFileMock.mockReturnValue(null)

      randomUUIDMock.mockReturnValue("uuid-uuid-uuid-uuid-uuid")
      createHashMock.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnThis(),
        toString: jest.fn(() => `newFilesHash`),
      } as unknown as Hash)

      const expectedResult = "newFilesHash_uuid-uuid-uuid-uuid-uuid.zip"
      expect(
        await localFleService.updateMultipleMedia(
          "oldFilesHash_uuid-uuid-uuid-uuid-uuid.zip",
          [
            {
              filename: "file",
              content: Buffer.from("content", "utf-8"),
              ext: "png",
              mimetype: "image/png",
            },
          ],
        ),
      ).toBe(expectedResult)
    })
  })
})
