import React from 'react'
import ReactDOM from 'react-dom'
import { Window, TitleBar, Text, View, Button, TextInput, Label,
ListView,
  ListViewHeader,
  ListViewFooter,
  ListViewSection,
  ListViewSectionHeader,
  ListViewRow,
  ListViewSeparator } from 'react-desktop/macOs';

import $ from 'jquery'


class ManageWindow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			info:null,
			isLogged: false,
			user: {
				username: null,
				password: null
			},
			status: null,
			data:[
				{
				id:1,
				name:'logan',
				stuno:'111111',
				department:'int',
				room:'607',
				center:'service',
				tuitor:'chen',
				email:'loganwhite@163.com',
				mobile:'1111111111',
				isdistributed:false
			}]
			
		}
	}

	handleClick(e) {
		e.preventDefault();
		this.setState({info:null});

		$.ajax({
			url:'login',
			method:'post',
			data: this.state.user,
			dataType: 'json',
			success: function(resData) {
				if (resData.IsSuccess) {
					this.setState({isLogged: true});
					this.getlist();
				}
				else
					this.setState({info:resData.Msg});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
				this.setState({info:err.toString()});
			}.bind(this)
		});

	}

	getlist() {
		$.ajax({
			url:'list',
			method:'get',
			dataType: 'json',
			success: function(resData) {
				if (!resData.IsSuccess) {
					this.setState({info:'获取申请信息失败！'});
					return;
				}
				this.setState({data:resData.Data});
					
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
				this.setState({info:err.toString()});
			}.bind(this)
		});
	}

	render() {

		let comp = null;
		if (this.state.isLogged) {
			let rows = this.state.data.map((item) => 
			(this.renderItem(item.id,item.name,item.stuno,item.room,item.department,item.center,item.tuitor,item.email,item.mobile,item.isdistributed)));

			comp = (				
				<ListView background="#f1f2f4" width="1000" height="550">
				<ListViewHeader>
				<Text size="11" color="#696969">Order by sequence</Text>
				</ListViewHeader>
				<ListViewSection >
					{this.renderItem('#','姓名','学号','房间','学院','中心/教研室','导师','邮箱','手机',true)}
					{rows}
				</ListViewSection>
				<ListViewFooter>
				<Text size="11" color="#696969">{this.state.status}</Text>
				</ListViewFooter>
				</ListView>
			);
		} else {
			comp = (
				<div>
				<TextInput
					label="用户名:"
					placeholder="用户名"
					defaultValue=""
					rounded="1em"
					width="20em"
					onChange={e => this.setState({user: {username:e.target.value,password:this.state.user.password }})}
				/>
				<TextInput
					label="密码:"
					placeholder="密码"
					defaultValue=""
					rounded="1em"
					width="20em"
					password
					onChange={e => this.setState({user: {password:e.target.value, username:this.state.user.username }})}
				/>
				<Button color="blue"
					onClick={this.handleClick.bind(this)}
					marginTop="20px">
					登录
				</Button>
				</div>
				
			);
		}

		return (
		<Window
			chrome
			height="700px"
			width="1100px"
			padding="10px"
			verticalAlignment="center"
			horizontalAlignment="center" >
			<View
					background="rgb(226, 226, 226)"
					padding="20px"
					paddingLeft="50px"
					paddingRight="50px"
					horizontalAlignment="center"
					layout="vertical"
				>
			<Label color="red">{this.state.info}</Label>
			{comp}
			<Label marginTop="50px"><a href="https://github.com/loganwhite/wifiapply">Logan Von</a></Label>
			</View>
			<TitleBar title="小黑WiFi路由器管理页面" controls/>
      	</Window>
		);
	}

	renderItem(id,name,stuno,room,department,center,tuitor,email,mobile,isdistributed) {
    return (
      <ListViewRow
        onClick={() => this.setState({ status: name })}
		onDoubleClick={function() {
			if (isdistributed) {
				this.setState({info:'已发放！'});
				return;
			}
			if (!confirm("确认发放？")) return;
			$.ajax({
				url:'distribute',
				method:'post',
				data:{'id':id},
				dataType: 'json',
				success: function(resData) {
					this.setState({info:resData.Msg});
					this.getlist();
						
				}.bind(this),
				error: function(xhr, status, err) {
					console.error(this.props.url, status, err.toString());
					this.setState({info:err.toString()});
				}.bind(this)
			});
		}.bind(this)}
        background={this.state.status === name ? '#d8dadc' : null}
      >
	  <Text width="1em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{id}</Text><div>|</div>
	  <Text width="4em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{name}</Text><div>|</div>
	  <Text width="5.5em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{stuno}</Text><div>|</div>
	  <Text width="6em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{room}</Text><div>|</div>
	  <Text width="10em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{department}</Text><div>|</div>
        <Text width="10em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{center}</Text><div>|</div>
		<Text width="4em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{tuitor}</Text><div>|</div>
		<Text width="13em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{email}</Text><div>|</div>
		<Text width="8em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{mobile}</Text><div>|</div>
		<Text width="1em" paddingRight="5px" paddingLeft="5px" color="#414141" size="13">{isdistributed ? '是' : '否'}</Text>
      </ListViewRow>
    );
  }

}

ReactDOM.render(<ManageWindow />, document.getElementById('app'));

