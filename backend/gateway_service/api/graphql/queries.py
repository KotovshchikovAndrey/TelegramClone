GET_ALL_CONVERSATIONS_FOR_CURRENT_USER = """query GetAllConversationsForCurrentUser {
    getAllConversationsForCurrentUser(limit: %(limit)s, offset: %(offset)s) {
        uuid
        name
        description
        avatar
        is_group
        last_message_at
        created_at
        unread_message_count
    }
}"""

CREATE_MESSAGE_WITH_FILES = """mutation createPersonalMessage($dto: CreatePersonalMessageDTO!, $files: [Upload!]! = []) {
    createPersonalMessage(dto: $dto, files: $files) {
        uuid
        text
        media_url
        status
        created_at
        sender {
            name
            surname
            avatar
        }
    }
}"""


CREATE_MESSAGE_WITHOUT_FILES = """mutation createPersonalMessage {
    createPersonalMessage(dto: {
        reciever: "%(reciever)s"
        text: "%(text)s"
    }, files: []) {
        uuid
        text
        media_url
        status
        created_at
        sender {
            name
            surname
            avatar
        }
    }
}"""


UPDATE_MESSAGE_WITH_FILES = """mutation updateMessage($dto: UpdateMessageDTO!, $files: [Upload!]! = []) {
    updateMessage(dto: $dto, files: $files) {
        uuid
        text
        media_url
        status
        created_at
        sender {
            name
            surname
            avatar
        }
    }
}"""


UPDATE_MESSAGE_WITHOUT_FILES = """mutation UpdateMessage {
    updateMessage(dto: {
        uuid: "%(uuid)s"
        text: "%(text)s"
    }, files: []) {
        uuid
        text
        media_url
        status
        created_at
        sender {
            name
            surname
            avatar
        }
    }
}"""

SET_MESSAGE_STATUS_FOR_CURRENT_USER = """mutation SetMessageStatusForCurrentUser {
    setMessageStatusForCurrentUser(dto: {
        message: "%(message)s",
        status: "%(status)%"
    }) {
        account
        message
        status
    }
}"""
