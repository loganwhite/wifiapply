import React from 'react'
import ReactDOM from 'react-dom'
import { View, Button, Label } from 'react-desktop/macOs';


import $ from 'jquery'


export default class DataList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data:null,
            info:null,
            
		}
	}

	handleClick(e) {

	}

    componentDidMount() {
        $.ajax({
            url:'applyList',
            method:'get',
            dataType:'json',
            success: function(resData) {
                if (!resData.IsSuccess) {
				    this.setState({info: resData.Msg});
                }
                this.setState({data:resData.Data});
            }.bind(this),
            error: function() {
				console.error(this.props.url, status, err.toString());
				this.setState({info:err.toString()});
            }.bind(this)
        });
    }

	render() {

		return (
			<View
				background="rgb(226, 226, 226)"
				padding="20px"
				paddingLeft="100px"
				paddingRight="100px"
				horizontalAlignment="center"
				layout="vertical"
			>
			<Label color="red">{this.state.info}</Label>

			<Label marginTop="50px"><a href="https://github.com/loganwhite/wifiapply">Logan Von</a></Label>
      		</View>
		);
	}
}

