import 'package:flutter/material.dart';

class ChatInput extends StatefulWidget {
  const ChatInput({super.key, required this.onSendMessage});

  final void Function(String text) onSendMessage;

  @override
  State<ChatInput> createState() => _ChatInputState();
}

class _ChatInputState extends State<ChatInput> {
  final _controller = TextEditingController();
  bool _isEdit = false;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_textEditHandler);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _textEditHandler() {
    setState(() {
      _isEdit = _controller.text.isNotEmpty;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.bottomCenter,
      child: TextFormField(
        controller: _controller,
        cursorColor: Colors.blue,
        style: const TextStyle(color: Colors.white, fontSize: 18),
        decoration: InputDecoration(
          hintText: "Cooбщение",
          hintStyle: const TextStyle(color: Colors.grey, fontSize: 18),
          filled: true,
          fillColor: const Color.fromARGB(255, 33, 47, 61),
          contentPadding: const EdgeInsets.all(15),
          focusedBorder: InputBorder.none,
          prefixIcon: _buildSmilesButton(),
          suffixIcon: _isEdit
              ? _buildSendButton()
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _buildFileButton(),
                    _buildVoiceMessageButton(),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildSendButton() {
    return IconButton(
      onPressed: () => widget.onSendMessage(_controller.text),
      icon: const Icon(
        Icons.send,
        color: Color.fromARGB(255, 77, 181, 255),
      ),
    );
  }

  Widget _buildFileButton() {
    return InkWell(
      onTap: () {},
      child: const Icon(
        Icons.attach_file,
        size: 27,
        color: Colors.grey,
      ),
    );
  }

  Widget _buildVoiceMessageButton() {
    return Padding(
      padding: const EdgeInsets.only(right: 15, left: 15),
      child: InkWell(
        onTap: () {},
        child: const Icon(
          Icons.mic_none_outlined,
          size: 27,
          color: Colors.grey,
        ),
      ),
    );
  }

  Widget _buildSmilesButton() {
    return InkWell(
      onTap: () {},
      child: const Icon(
        Icons.tag_faces_sharp,
        size: 27,
        color: Colors.grey,
      ),
    );
  }
}
