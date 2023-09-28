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
  randomUUID: jest.fn().mockReturnValue("uuidMock"),
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnThis(),
    toString: jest.fn(() => "hashMock"),
  } as unknown as Hash),
}))

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
      const expectedResult = `hashMock.${file.ext}`
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
      const expectedResult = `hashMock_uuidMock.zip`
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

      await expect(
        localFleService.uploadMultipleMedia([bigFile]),
      ).rejects.toThrow(Error)

      const fileWithNotAllowedExt = {
        filename: "file",
        content: Buffer.from(bigString, "utf-8"),
        ext: "gif",
        mimetype: "image/gif",
      }

      writeFileMock.mockReturnValue(null)
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
      writeFileMock
        .mockImplementationOnce(() => {
          throw Error("uploadMediaCache test fail!")
        })
        .mockReset()

      const expectedResult = "hashMock.png"
      expect(await localFleService.uploadMedia(file)).toBe(expectedResult)
    })
  })

  // Check is multiple upload method cached exists files and not write this again
  describe("updateMultipleMediaCache", () => {
    it("should return exists media path", async () => {
      unlickMock
        .mockImplementationOnce(() => {
          throw Error("updateMultipleMediaCache test fail!")
        })
        .mockReset()

      const expectedResult = "hashMock_uuidMock.zip"
      expect(
        await localFleService.updateMultipleMedia("hashMock_uuidMock.zip", [
          {
            filename: "file",
            content: Buffer.from("content", "utf-8"),
            ext: "png",
            mimetype: "image/png",
          },
        ]),
      ).toBe(expectedResult)
    })
  })

  // Check is multiple update work correct
  describe("updateMultipleMedia", () => {
    it("should return new media path", async () => {
      unlickMock.mockReturnValue(null)
      writeFileMock.mockReturnValue(null)

      const expectedResult = "hashMock_uuidMock.zip"
      expect(
        await localFleService.updateMultipleMedia("oldHash_uuid.zip", [
          {
            filename: "file",
            content: Buffer.from("content", "utf-8"),
            ext: "png",
            mimetype: "image/png",
          },
        ]),
      ).toBe(expectedResult)
    })
  })
})
