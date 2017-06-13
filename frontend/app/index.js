import React from 'react'
import ReactDOM from 'react-dom'
import { Window, TitleBar, Text, View, Button, TextInput, Label } from 'react-desktop/macOs';

import $ from 'jquery'


class ApplyWindow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name:null,
			stuno:null,
			room:null,
			school:null,
			tuitor:null,
			email:null,
			mobile:null
		}
	}

	handleClick(e) {
		e.preventDefault();
		this.setState({info:null});
		if (!isPhone(this.state.mobile)) {
			this.setState({info:"手机号格式有误!"});
			return;
		}
		if (!isEmail(this.state.email)) {
			this.setState({info:"邮箱格式有误!"});
			return;
		}
		if (!isStuno(this.state.stuno)) {
			this.setState({info:"学号格式有误!"});
			return;
		}
		if (!isRoomNum(this.state.room)) {
			this.setState({info:"房间号格式有误!"});
			return;
		}

		this.setState({info:null});

		$.ajax({
			url:'submit',
			method:'post',
			data: this.state,
			dataType: 'json',
			success: function(resData) {
				this.setState({info: resData.Msg});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
				this.setState({info:err.toString()});
			}.bind(this)
		});

	}

	render() {

		return (
		<Window
			chrome
			height="500px"
			width="800px"
			padding="10px"
			verticalAlignment="center"
			horizontalAlignment="center" >
			<View
				background="rgb(226, 226, 226)"
				padding="20px"
				paddingLeft="100px"
				paddingRight="100px"
				horizontalAlignment="center"
				layout="vertical"
			>
			<Label color="red">{this.state.info}</Label>
			<TextInput
				label="姓名:"
				placeholder="申请人姓名..."
				defaultValue=""
				rounded="10"
				width="20em"
				onChange={e => this.setState({name:e.target.value})}
			/>
			<TextInput
				label="学号:"
				placeholder="申请人学号..."
				defaultValue=""
				rounded="10"
				width="20em"
				onChange={e => this.setState({stuno:e.target.value})}
			/>
			<TextInput
				label="放置房间(格式:楼-号(门牌号四位,不够的前面补0,要不谁帮我写下这个正则)):"
				placeholder="放置房间号,如学5-1234,科-607,教主-1122"
				defaultValue=""
				rounded="10"
				width="20em"
				onChange={e => this.setState({room:e.target.value})}
			/>
			<TextInput
				label="学院:"
				placeholder="申请人所在学院..."
				defaultValue=""
				rounded="10"
				width="20em"
				onChange={e => this.setState({school:e.target.value})}
			/>
			<TextInput
				label="导师:"
				placeholder="学生导师..."
				defaultValue=""
				rounded="10"
				width="20em"
				onChange={e => this.setState({tuitor:e.target.value})}
			/>
			<TextInput
				label="邮箱:"
				placeholder="申请人邮箱..."
				defaultValue=""
				rounded="10"
				width="20em"
				onChange={e => this.setState({email:e.target.value})}
			/>
			<TextInput
				label="手机:"
				placeholder="申请人手机号..."
				defaultValue=""
				rounded="10"
				width="20em"
				onChange={e => this.setState({mobile:e.target.value})}
			/>
			<Button color="blue"
				onClick={this.handleClick.bind(this)}
				marginTop="20px">
				提交
			</Button>
      		</View>
			<TitleBar title="小黑WiFi路由器申请页面" controls/>
      	</Window>
		);
	}
}

ReactDOM.render(<ApplyWindow />, document.getElementById('app'));

function isPhone(aPhone) {  
	var bValidate = RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(aPhone);  
	return bValidate;
}

function isEmail(str){
       var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
       return reg.test(str);
}

function isStuno(str) {
	var reg = /^20[0-2][0-9]{7}$/;
	return reg.test(str);
}

function isRoomNum(str) {
	var reg = /^(学([12345689]|10|13|29))|(教([1-4]|主))|科-[0-9]{4}$/;
	return reg.test(str);
}