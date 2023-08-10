create_message = """mutation createMessage($dto: CreateMessageDTO!, $files: [Upload!]! = []) {
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
