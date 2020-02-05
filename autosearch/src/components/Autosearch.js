import React from "react";
import axios from "axios";

import "./Autosearch.css";
import "./florasearch.css";
import "./citysearch.css";

class Autosearch extends React.Component {
    constructor(props) {
        super(props);

        // create state object w/ autocomplete props
        this.state = {
            query: '',
            suggestions: [],
            loading: false,
            message: '',
            activeSuggestion: 0
        }

        // create cancel token property to abort axios calls
        this.cancelToken = '';
    }

    // ----- HANDLE INPUT CHANGE ----- //
    handleInputChange = e => {
        const query = e.target.value;
        // update state with input value
        this.setState(
            {
                query: query,
                loading: true,
                message: ""
            },
            // callback to ensure axios search fires after state is updated
            () => { this.fetchSearchResults(query); }
        );
    }

    // ----- MAKE AXIOS SEARCH CALL ----- //
    fetchSearchResults = (query) => {
        const queryUrl = `https://coding-challenge.echoandapex.com/locations?q=${query}`

        // if a previous search is in progress, cancel it (limit calls from successive letter inputs)
        if (this.cancelToken) {
            this.cancelToken.cancel();
        }

        // create an axios cancel token for the current request
        this.cancelToken = axios.CancelToken.source();

        // make axios request
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

    // ----- HANDLE KEYBOARD NAVIGATION FOR PREDICTIONS ----- //
    keyboardEventHandler = (e) => {
        // if there are suggestions available and ENTER is pressed, choose the active suggestion
        if (e.keyCode === 13 && this.state.suggestions.length) {
            this.suggestionSelectHandler(this.state.suggestions[this.state.activeSuggestion].name)
            // if the UP arrow is pressed...
        } else if (e.keyCode === 38) {
            //...and you're at the top of the list, ignore
            if (this.state.activeSuggestion === 0) {
                return;
            }
            //...otherwise, move the active selection up
            this.setState({ activeSuggestion: this.state.activeSuggestion - 1 });
            // if the DOWN arrow is pressed...
        } else if (e.keyCode === 40) {
            //...and you're at the bottom of the list, ignore
            if (this.state.activeSuggestion === this.state.suggestions.length - 1) {
                return;
            }
            //...otherwise, move the active selection down
            this.setState({ activeSuggestion: this.state.activeSuggestion + 1 })
        }
    }

    // ----- CHOOSE A PREDICTION ----- //
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