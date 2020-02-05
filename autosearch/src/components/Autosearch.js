import React from "react";
import axios from "axios";

import "./Autosearch.css";
import "./florasearch.css";
import "./citysearch.css";

class Autosearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            suggestions: [],
            loading: false,
            message: '',
            activeSuggestion: 0
        }

        this.cancelToken = '';
    }

    handleInputChange = e => {
        const query = e.target.value;
        this.setState(
            {
                query: query,
                loading: true,
                message: ""
            },
            () => { this.fetchSearchResults(query); }
        );
    }

    fetchSearchResults = (query) => {
        const queryUrl = `https://coding-challenge.echoandapex.com/locations?q=${query}`

        if (this.cancelToken) {
            this.cancelToken.cancel();
        }

        this.cancelToken = axios.CancelToken.source();

        axios.get(
            queryUrl,
            { cancelToken: this.cancelToken.token }
        ).then(res => {
            const noResultsMsg = !res.data.predictions.length ? "No locations match your search. Please try a new search" : "";
            this.setState({
                suggestions: res.data.predictions,
                message: noResultsMsg,
                loading: false,
                activeSuggestion: 0
            });
        }).catch(err => {
            this.setState({
                suggestions: [],
                isLoading: false,
                message: "Failed to retrieve data. Please try again",
                activeSuggestion: 0
            })
        })
    }

    keyboardEventHandler = (e) => {

        if (e.keyCode === 13 && this.state.suggestions.length) {
            this.suggestionSelectHandler(this.state.suggestions[this.state.activeSuggestion].name)
        } else if (e.keyCode === 38) {
            if (this.state.activeSuggestion === 0) {
                return;
            }
            this.setState({ activeSuggestion: this.state.activeSuggestion - 1 });
        } else if (e.keyCode === 40) {
            if (this.state.activeSuggestion === this.state.suggestions.length - 1) {
                return;
            }
            this.setState({ activeSuggestion: this.state.activeSuggestion + 1 })
        }
    }


    suggestionSelectHandler = (value) => {
        this.setState({
            query: value,
            suggestions: [],
            loading: false, message: '',
            activeSuggestion: 0
        });
    }

    render() {

        const { query } = this.state;

        return (
            <div class="autosearch">
                <div className={this.props.class + "search"}>
                    <div className="banner" style={{ backgroundImage: `url(${this.props.class}.jpg)` }}></div>
                    <label className="search-label" htmlFor="search-input">
                        <input
                            type="text"
                            id="search-input"
                            value={query}
                            placeholder="Search for a location..."
                            onChange={this.handleInputChange}
                            onKeyDown={this.keyboardEventHandler}
                        />
                    </label>
                    <ul>
                        {this.state.suggestions.map((res, index) => {
                            let className = "";
                            if (index === this.state.activeSuggestion) {
                                className = "activeSuggestion"
                            }
                            return (
                                <li
                                    key={index}
                                    onClick={() => this.suggestionSelectHandler(res.name)}
                                    className={className}
                                >{res.name} <br /> {res.description}</li>);
                        })}
                    </ul>
                </div>

            </div >
        )
    }
}

export default Autosearch;