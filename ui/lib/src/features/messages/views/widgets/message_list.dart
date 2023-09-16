import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/features/messages/models/message.dart';
import 'package:ui/src/features/messages/views/bloc/chat_bloc.dart';
import 'package:ui/src/features/messages/views/widgets/message_item.dart';

class MessageList extends StatefulWidget {
  const MessageList({super.key});

  @override
  State<MessageList> createState() => _MessageListState();
}

class _MessageListState extends State<MessageList> {
  final _scrollController = ScrollController();
  List<Message> messages = [];

  @override
  Widget build(BuildContext context) {
    final chatBloc = BlocProvider.of<ChatBloc>(context);

    return BlocBuilder(
      bloc: chatBloc,
      builder: (context, state) {
        if (state is ConversationLoading) {
          return const Center(
            child: CircularProgressIndicator(
              color: Colors.blue,
              strokeWidth: 2,
            ),
          );
        }

        if (state is ChatMessageList) {
          messages = state.messages;
          // WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
          //   _scrollController.animateTo(
          //     _scrollController.position.maxScrollExtent,
          //     duration: const Duration(milliseconds: 300),
          //     curve: Curves.easeInOut,
          //   );
          // });
        }

        return ListView.builder(
          reverse: true,
          controller: _scrollController,
          itemCount: messages.length,
          padding: const EdgeInsets.only(bottom: 70),
          itemBuilder: (context, index) {
            return MessageItem(
              isMyMessage: true,
              text: messages[messages.length - index - 1].text,
              date: messages[messages.length - index - 1].date,
            );
          },
        );
      },
    );
  }
}
