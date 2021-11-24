import React, { Component } from "react";
import axios from "axios";
import { Bar, Radar } from "react-chartjs-2";
import { Container, Row, Col } from "react-bootstrap";

export default class Analytics extends Component {
  constructor(props) {
    super(props);

    this.onChangeRankF1 = this.onChangeRankF1.bind(this);
    this.onChangeCountryF1 = this.onChangeCountryF1.bind(this);
    this.onChangeDateF1 = this.onChangeDateF1.bind(this);
    this.onGoF1 = this.onGoF1.bind(this);

    this.state = {
      F1Data: {
        labels: [],
        datasets: [],
      },
      F2Data: {
        labels: [],
        datasets: [],
      },
      F3Data: {
        labels: [],
        datasets: [],
      },
      F4Data: {
        labels: [],
        datasets: [],
      },
      F5Data: {
        labels: [],
        datasets: [],
      },
      F6Data: {
        labels: [],
        datasets: [],
      },
      rankF1: "",
      countryF1: "Global",
      dateF1: "",
    };
  }

  onChangeRankF1(e) {
    this.setState({ rankF1: e.target.value });
  }
  onChangeCountryF1(e) {
    this.setState({ countryF1: e.target.value });
  }
  onChangeDateF1(e) {
    this.setState({ dateF1: e.target.value });
  }

  onGoF1(e) {
    if (this.state.rankF1 === "" || this.state.dateF1 === "")
      alert("Error: please fill out all fields.");
    else {
      const searchTerm = {
        rank: this.state.rankF1,
        country: this.state.countryF1,
        date: this.state.dateF1,
      };

      axios.post("http://localhost:5000/posts/analytics/f1", searchTerm);

      this.setState({
        rankF1: "",
        countryF1: "Global",
        dateF1: "",
      });

      this.updateF1Chart();
    }
  }

  componentDidMount() {
    this.updateF1Chart();
    this.updateF2Chart();
    this.updateF3Chart();
    this.updateF4Chart();
    this.updateF5Chart();
    this.updateF6Chart();
  }

  async updateF1Chart() {
    let F1Data = { labels: [], average: [], data: [] };

    //Need to pass in labels, average, and data
    await fetch("http://localhost:5000/posts/analytics/f1")
      .then((res) => res.json())
      .then((data) => {
        F1Data = data;
      });

    this.setState({
      F1Data: {
        labels: F1Data.labels,
        datasets: [
          {
            label: "Chart's Average",
            data: F1Data.average,
            backgroundColor: ["rgba(30, 215, 96, 0.1)"],
          },
          {
            label: "Song Characteristics",
            data: F1Data.data,
            backgroundColor: ["rgba(22, 22, 29, 0.1)"],
          },
        ],
      },
    });
  }

  async updateF2Chart() {
    let F2Data = { labels: [], data: [] };

    //Need to pass in labels, and data
    await fetch("http://localhost:5000/posts/analytics/f2")
      .then((res) => res.json())
      .then((data) => {
        F2Data = data;
      });

    this.setState({
      F2Data: {
        labels: F2Data.labels,
        datasets: [
          {
            label: "Top genres by country",
            data: F2Data.data,
            backgroundColor: ["rgba(22, 22, 29, 0.5)"],
          },
        ],
      },
    });
  }

  async updateF3Chart() {
    let F3Data = { labels: [], data: [] };

    //Need to pass in labels, and data
    await fetch("http://localhost:5000/posts/analytics/f3")
      .then((res) => res.json())
      .then((data) => (F3Data = data));

    this.setState({
      F3Data: {
        labels: F3Data.labels,
        datasets: [
          {
            label: "Which artists have the most songs in top 10",
            data: F3Data.data,
            backgroundColor: ["rgba(22, 22, 29, 0.5)"],
          },
        ],
      },
    });
  }

  async updateF4Chart() {
    let F4Data = { labels: [], data: [] };

    //Need to pass in labels, and data
    await fetch("http://localhost:5000/posts/analytics/f4")
      .then((res) => res.json())
      .then((data) => (F4Data = data));

    this.setState({
      F4Data: {
        labels: F4Data.labels,
        datasets: [
          {
            label: "Which artists have the most followers",
            data: F4Data.data,
            backgroundColor: ["rgba(22, 22, 29, 0.5)"],
          },
        ],
      },
    });
  }

  async updateF5Chart() {
    let F5Data = { labels: [], data: [] };

    //Need to pass in labels, and data
    await fetch("http://localhost:5000/posts/analytics/f5")
      .then((res) => res.json())
      .then((data) => (F5Data = data));

    this.setState({
      F5Data: {
        labels: F5Data.labels,
        datasets: [
          {
            label: "Top songs with most #1 spots",
            data: F5Data.data,
            backgroundColor: ["rgba(22, 22, 29, 0.5)"],
          },
        ],
      },
    });
  }

  async updateF6Chart() {
    let F6Data = { labels: [], data: [] };

    //Need to pass in labels, and data
    await fetch("http://localhost:5000/posts/analytics/f6")
      .then((res) => res.json())
      .then((data) => (F6Data = data));

    this.setState({
      F6Data: {
        labels: F6Data.labels,
        datasets: [
          {
            label: "Top artists with most #1 Songs",
            data: F6Data.data,
            backgroundColor: ["rgba(22, 22, 29, 0.5)"],
          },
        ],
      },
    });
  }

  render() {
    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
              <Row>
                <div>
                  <form onSubmit={this.onGoF1}>
                    <table className="inputTable">
                      <thead>
                        <tr>
                          <td className="tableCell__rank__input">
                            <input
                              type="number"
                              placeholder="Rank"
                              className="form-control"
                              min="1"
                              max="200"
                              value={this.state.rankF1}
                              onChange={this.onChangeRankF1}
                            />
                          </td>
                          <td className="tableCell__country__input">
                            <select
                              className="country__input"
                              value={this.state.countryF1}
                              onChange={this.onChangeCountryF1}
                              defaultValue="Global"
                            >
                              <option value="Global">Global</option>
                              <option value="Australia">Australia</option>
                              <option value="Canada">Canada</option>
                              <option value="France">France</option>
                              <option value="Malaysia">Malaysia</option>
                              <option value="Mexico">Mexico</option>
                              <option value="Netherlands">Netherlands</option>
                              <option value="Sweden">Sweden</option>
                              <option value="UK">UK</option>
                              <option value="USA">USA</option>
                            </select>
                          </td>
                          <td className="tableCell__country__input">
                            <input
                              type="date"
                              className="form-control"
                              value={this.state.dateF1}
                              onChange={this.onChangeDateF1}
                            />
                          </td>
                          <td className="tableCell__input">
                            <input
                              type="submit"
                              value="Go"
                              className="btn btn-primary"
                            />
                          </td>
                        </tr>
                      </thead>
                    </table>
                  </form>
                </div>
              </Row>
              <Row>
                <Radar
                  data={this.state.F1Data}
                  options={{
                    scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                  }}
                />
              </Row>
            </Col>
            <Col>
              <Row>
                <Bar
                  data={this.state.F2Data}
                  options={{
                    scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                  }}
                />
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Bar
                data={this.state.F3Data}
                options={{
                  scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                }}
              />
            </Col>
            <Col>
              <Bar
                data={this.state.F4Data}
                options={{
                  scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                }}
              />
            </Col>
            <Row>
              <Col>
                <Bar
                  data={this.state.F5Data}
                  options={{
                    scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                  }}
                />
              </Col>
              <Col>
                <Bar
                  data={this.state.F6Data}
                  options={{
                    scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                  }}
                />
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    );
  }
}
