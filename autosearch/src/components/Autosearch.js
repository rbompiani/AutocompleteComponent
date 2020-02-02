import React from "react";
import axios from "axios";

class Autosearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            results: [],
            loading: false,
            message: ''
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
            this.setState({ results: res.data.predictions, message: noResultsMsg, loading: false });
        }).catch(err => {
            this.setState({ isLoading: false, message: "Failed to retrieve data. Please try again" })
        })
    }

    renderSearchResults = () => {

    }

    render() {

        const { query } = this.state;

        return (
            <div>
                <h1>Autocomplete Search</h1>
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
                    {this.state.results.map(res => {
                        return (<li>{res.name}</li>);
                    })}
                </ul>
            </div >
        )
    }
}

export default Autosearch;