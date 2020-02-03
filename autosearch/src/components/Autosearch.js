import React from "react";
import axios from "axios";

import "./Autosearch.css";

class Autosearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            suggestions: [],
            loading: false,
            message: '',
            selected: ''
        }

        this.cancelToken = '';
    }

    handleInputChange = e => {
        const query = e.target.value;
        this.setState({ query: query, loading: true, message: "" }, () => {
            this.fetchSearchResults(query);
        });
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
            this.setState({ suggestions: res.data.predictions, message: noResultsMsg, loading: false });
        }).catch(err => {
            this.setState({ suggestions: [], isLoading: false, message: "Failed to retrieve data. Please try again" })
        })
    }

    suggestionSelectHandler = (value) => {
        this.setState({ query: value, suggestions: [] });
    }

    render() {

        const { query } = this.state;

        return (
            <div >
                <h1>Autocomplete Search</h1>
                <div className="autosearch">
                    <label className="search-label" htmlFor="search-input">
                        <input
                            type="text"
                            id="search-input"
                            value={query}
                            placeholder="Search for a location..."
                            onChange={this.handleInputChange}
                        />
                    </label>
                    <ul>
                        {this.state.suggestions.map(res => {
                            return (<li onClick={() => this.suggestionSelectHandler(res.name)}>{res.name}</li>);
                        })}
                    </ul>
                </div>

            </div >
        )
    }
}

export default Autosearch;