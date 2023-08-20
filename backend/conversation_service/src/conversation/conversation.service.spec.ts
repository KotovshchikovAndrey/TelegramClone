import { Test, TestingModule } from "@nestjs/testing"
import { ConversationService } from "./conversation.service"
import { FileModule } from "../file/file.module"
import { FileService } from "../file/file.service"
import { User } from "../app.entity"
import { randomUUID } from "crypto"

describe("ConversationService", () => {
  let conversationService: ConversationService
  let fileService: FileService

  const userConversations = [
    {
      uuid: "fb74c58b-6af5-4bf6-a615-0ff4a6139f2c",
      is_group: true,
    },
    {
      uuid: "52d35ee3-cea9-4e9f-80c8-19434d3d2e4f",
      is_group: false,
    },
  ]

  const mockConversationRepository = {
    findAllUserConversations: jest.fn(
      ({
        user_account,
        limit,
        offset,
      }: {
        user_account: string
        limit: number
        offset: number
      }) => Promise.resolve(userConversations),
    ),

    findPersonalConversationByName: jest.fn((name) => {
      const oldConversation = {
        uuid: "old-conversation",
        name: "db342842fd1e4346bf12441a32c7729461e4f428c9737a4e318af97b50b4d877", // hash "first_user.second_user"
      }

      return oldConversation
    }),

    createConversation: jest.fn((dto) => {
      const newConversation = {
        uuid: "new-conversation",
        name: "new-name",
      }

      return newConversation
    }),

    createMessage: jest.fn((dto) => {
      return {
        uuid: "new-message",
        conversation: dto.conversation,
      }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FileModule],
      providers: [
        ConversationService,
        {
          provide: "ConversationRepository",
          useValue: mockConversationRepository,
        },
      ],
    }).compile()

    conversationService = module.get<ConversationService>(ConversationService)
    fileService = module.get<FileService>(FileService)
  })

  it("should be defined", () => {
    expect(conversationService).toBeDefined()
  })

  it("should return 2 conversation items", async () => {
    const currentUser = new User()
    currentUser.user_uuid = randomUUID()

    expect(
      await conversationService.getUserConversations(currentUser, {
        limit: 10,
        offset: 0,
      }),
    ).toBe(userConversations)
  })

  it("should not create new conversation", async () => {
    const currentUser = new User()
    currentUser.user_uuid = "first_user"

    expect(
      await conversationService.createPersonalMessage(
        currentUser,
        {
          reciever_uuid: "second_user",
          text: "text_aaaaaaaaaaaaa",
        },
        [],
      ),
    ).toEqual({
      uuid: "new-message",
      conversation: "old-conversation",
    })
  })
})
