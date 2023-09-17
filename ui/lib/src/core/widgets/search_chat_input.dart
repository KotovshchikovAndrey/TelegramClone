import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ui/src/features/messages/views/bloc/chat_bloc.dart';

class SearchChatInput extends StatefulWidget {
  const SearchChatInput({
    super.key,
    required this.onClickCloseInput,
  });

  final void Function() onClickCloseInput;

  @override
  State<SearchChatInput> createState() => _SearchChatInputState();
}

class _SearchChatInputState extends State<SearchChatInput> {
  final _searchInputController = TextEditingController();

  @override
  void initState() {
    _searchInputController.addListener(
      () => _setSearchParams(_searchInputController.text),
    );

    super.initState();
  }

  @override
  void dispose() {
    _searchInputController.dispose();
    super.dispose();
  }

  void _setSearchParams(String text) {
    final chatBloc = BlocProvider.of<ChatBloc>(context);
    chatBloc.add(FilterChatsByName(name: text));
  }

  void _resetSearchParams() {
    final chatBloc = BlocProvider.of<ChatBloc>(context);
    chatBloc.add(ResetChatFilters());
    widget.onClickCloseInput();
  }

  @override
  Widget build(BuildContext context) {
    return Flexible(
      child: Padding(
        padding: EdgeInsets.only(
          left: MediaQuery.of(context).size.width / 6,
        ),
        child: TextField(
          controller: _searchInputController,
          style: const TextStyle(color: Colors.white),
          cursorColor: Colors.blue,
          decoration: InputDecoration(
            suffixIcon: InkWell(
              onTap: _resetSearchParams,
              child: const Icon(
                Icons.close,
                color: Colors.white,
                size: 18,
              ),
            ),
            focusedBorder: const UnderlineInputBorder(
              borderSide: BorderSide(
                color: Colors.grey,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
