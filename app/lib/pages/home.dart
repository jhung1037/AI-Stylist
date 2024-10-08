import 'package:app/models/query_models.dart';
import 'package:flutter/material.dart';
import 'package:chat_bubbles/chat_bubbles.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // dummy queries
  List<QueryModel> query = [];

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    // TODO: Wide Screen adjustment
    double imgWidth = screenWidth * 0.4;
    double imgHeight = imgWidth / 9 * 16;
    // dummy queries
    query = QueryModel.getQuery();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFFFFEEEE),
        title: const Text('Miss Purrfect', style: TextStyle(fontFamily: 'Tangerine', fontSize: 30)),
      ),
      backgroundColor: const Color(0xFFFFEEEE),
      body: Padding(
        padding: const EdgeInsets.all(15),
        child: Stack(
          children: [
            Positioned.fill(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFFE9DCDC),
                          border: Border.all(color: const Color(0xFFCCBCBC)),
                          shape: BoxShape.circle,
                        ),
                        height: 42,
                        width: 42,
                      ),
                      const SizedBox(width: 12),
                      const Expanded(child: Text('Lorem ipsum odor amet, consectetuer adipiscing elit. Est odio semper vitae fames, taciti urna leo penatibus.'))
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(width: 10),
                      Placeholder(fallbackHeight: imgHeight, fallbackWidth: imgWidth,),
                      const SizedBox(width: 20),
                      const Expanded(child: Text('Lorem ipsum odor amet, consectetuer adipiscing elit. Est odio semper vitae fames, taciti urna leo penatibus. Pellentesque magnis sodales fusce euismod integer. Gravida nunc euismod ultricies massa proin morbi volutpat.'))
                    ]
                  ),
                  const SizedBox(height: 20),
                  const Expanded(child: Text('Pellentesque magnis sodales fusce euismod integer. Gravida nunc euismod ultricies massa proin morbi volutpat.')),
                ],
              ),
            ),
            // make scrollable with past query history
            Positioned(
              left: 0, right: 0, bottom: 0,
              child: Container(
                height: 120,
                child: ListView.separated(
                  itemCount: query.length,
                  separatorBuilder: (context, index) => const SizedBox(height: 5),
                  itemBuilder: (context, index) {
                    return BubbleSpecialThree(
                      text: query[index].query,
                      color: Color(0xFFE9DCDC),
                      tail: true,
                      textStyle: const TextStyle(
                        color: Colors.black,
                        fontSize: 14,
                      ),
                    );
                  },
                ),
              ),
            )
          ] 
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.only(left:15, right: 15, bottom: 15, top: 1),
        decoration: const BoxDecoration(
          color: Color(0xFFFFEEEE),
        ),
        child: Row(
          children: [
            Expanded(
              // TODO: make text field area expand
              child: TextField(
                decoration: InputDecoration(
                  prefixIcon: IconButton(
                    icon: const Icon(Icons.mic),
                    onPressed: () {
                      // Handle send button press
                    },
                  ),
                  hintText: 'What is your need today?',
                  // hintStyle: const TextStyle(fontSize: 14),
                  border: const OutlineInputBorder(
                    // borderSide: BorderSide(width: 2),
                    borderRadius: BorderRadius.all(Radius.circular(30))
                  ),
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.send),
                    iconSize: 20,
                    onPressed: () {
                      // Handle send button press
                    },
                  )
                )
              ),
            ),
            const SizedBox(width: 8),
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () {
                // Handle send button press
              },
            ),
          ]
        ),
      )
    );
  }
}