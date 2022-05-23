// Books.js
import React from "react";
import { connect } from "react-redux";
import { appendData } from "./action";

class Library extends React.Component {
  componentDidMount() {
    let name = "Anastasia";
    let arr = [];

    arr.push({
      book_id: 1,
      title: "Dune",
      author: "Frank Herbert",
      year: 1965,
    });

    arr.push({
      book_id: 2,
      title: "Hyperion",
      author: "Dan Simmons",
      year: 1989,
    });

    this.props.appendData({
      name: name,
      books: [...this.props.books, ...arr],
    });
  }

  render() {
    const { name, books } = this.props;

    let booksList =
      books.length > 0 &&
      books.map((item, i) => {
        return (
          <li key={i} value={item.book_id}>
            {item.title} by {item.author} ({item.year})
          </li>
        );
      }, this);

    return (
      <div>
        <h1>Hello {name}!</h1>
        <ol>{booksList}</ol>
      </div>
    );
  }
}

const mapDispatchToProps = {
  appendData,
};

const mapStateToProps = (state) => ({
  name: state.name,
  books: state.books,
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
