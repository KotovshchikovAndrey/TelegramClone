create_message_with_files = """mutation createMessage($dto: CreateMessageDTO!, $files: [Upload!]! = []) {
    createMessage(dto: $dto, files: $files) {
        uuid
        text
        media_url
        created_at
        send_from
        send_to
        status
    }
}"""

create_message_without_files = """mutation CreateMessage {
    createMessage(dto: {
        send_to: "%(send_to)s"
        text: "%(text)s"
    }, files: []) {
        uuid
        text
        media_url
        created_at
        send_from
        send_to
        status
    }
}"""


update_message_with_files = """mutation updateMessage($dto: UpdateMessageDTO!, $files: [Upload!]! = []) {
    updateMessage(dto: $dto, files: $files) {
        uuid
        text
        media_url
        created_at
        send_from
        send_to
        status
    }
}"""


update_message_without_files = """mutation UpdateMessage {
    updateMessage(dto: {
        uuid: "%(uuid)s"
        text: "%(text)s"
    }, files: []) {
        uuid
        text
        media_url
        created_at
        send_from
        send_to
        status
    }
}"""
