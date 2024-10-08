class QueryModel{
  String query;

  QueryModel({
    required this.query,
  });

  static List<QueryModel> getQuery(){
    List<QueryModel> query = [];

    query.add(
      QueryModel(
        query: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Est odio semper vitae fames, taciti urna leo penatibus.'
      )
    );

    query.add(
      QueryModel(
        query: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Est odio semper vitae fames, taciti urna leo penatibus.'
      )
    );

    query.add(
      QueryModel(
        query: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Est odio semper vitae fames, taciti urna leo penatibus.'
      )
    );

    return query;
    
  }

}