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
				<Button
					onClick={function() {
						$.fn.excelexportjs({
							containerid: "dvjson"
							, datatype: 'json'
							, dataset: this.state.data
							, columns: [
								{ headertext: "No", datatype: "number", datafield: "id", ishidden: false }
								, { headertext: "姓名", datatype: "string", datafield: "name", width: "100px" }
								, { headertext: "学号", datatype: "string", datafield: "stuno", ishidden: false, width: "100px" }
								, { headertext: "房间", datatype: "string", datafield: "room", ishidden: false }
								, { headertext: "学院", datatype: "string",  datafield: "department", ishidden: false, width: "150px" }
								, { headertext: "中心/教研室", datatype: "string",  datafield: "center", ishidden: false, width: "150px" }
								, { headertext: "导师", datatype: "string",  datafield: "tuitor", ishidden: false, width: "150px" }
								, { headertext: "邮箱", datatype: "string",  datafield: "email", ishidden: false, width: "150px" }
								, { headertext: "手机", datatype: "string",  datafield: "mobile", ishidden: false, width: "150px" }
								, { headertext: "是否发放", datatype: "number",  datafield: "isdistributed", ishidden: false, width: "150px" }
							]
						});

					}.bind(this)}
					marginTop="20px">
					导出Excel
				</Button>
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

(function ($) {
    var $defaults = {
        containerid: null
        , datatype: 'table'
        , dataset: null
        , columns: null
        , returnUri: false
        , worksheetName: "My Worksheet"
        , encoding: "utf-8"
    };

    var $settings = $defaults;

    $.fn.excelexportjs = function (options) {
        $settings = $.extend({}, $defaults, options);

        var gridData = [];
        var excelData;

        return Initialize();

        function Initialize() {
            var type = $settings.datatype.toLowerCase();

            BuildDataStructure(type);

            switch (type) {
                case 'table':
                    excelData = Export(ConvertFromTable());
                    break;
                case 'json':
                    excelData = Export(ConvertDataStructureToTable());
                    break;
                case 'xml':
                    excelData = Export(ConvertDataStructureToTable());
                    break;
                case 'jqgrid':
                    excelData = Export(ConvertDataStructureToTable());
                    break;
            }

            if ($settings.returnUri) {
                return excelData;
            }
            else {
                window.open(excelData);
            }
        }

        function BuildDataStructure(type) {
            switch (type) {
                case 'table':
                    break;
                case 'json':
                    gridData = $settings.dataset;
                    break;
                case 'xml':
                    $($settings.dataset).find("row").each(function (key, value) {
                        var item = {};

                        if (this.attributes != null && this.attributes.length > 0) {
                            $(this.attributes).each(function () {
                                item[this.name] = this.value;
                            });

                            gridData.push(item);
                        }
                    });
                    break;
                case 'jqgrid':
                    $($settings.dataset).find("rows > row").each(function (key, value) {
                        var item = {};

                        if (this.children != null && this.children.length > 0) {
                            $(this.children).each(function () {
                                item[this.tagName] = $(this).text();
                            });

                            gridData.push(item);
                        }
                    });
                    break;
            }
        }

        function ConvertFromTable() {
            var result = $('<div>').append($('#' + $settings.containerid).clone()).html();
            return result;
        }

        function ConvertDataStructureToTable() {
            var result = "<table>";

            result += "<thead><tr>";
            $($settings.columns).each(function (key, value) {
                if (this.ishidden != true) {
                    result += "<th";
                    if (this.width != null) {
                        result += " style='width: " + this.width + "'";
                    }
                    result += ">";
                    result += this.headertext;
                    result += "</th>";
                }
            });
            result += "</tr></thead>";

            result += "<tbody>";
            $(gridData).each(function (key, value) {
                result += "<tr>";
                $($settings.columns).each(function (k, v) {
                    if (value.hasOwnProperty(this.datafield)) {
                        if (this.ishidden != true) {
                            result += "<td";
                            if (this.width != null) {
                                result += " style='width: " + this.width + "'";
                            }
                            result += ">";
                            result += value[this.datafield];
                            result += "</td>";
                        }
                    }
                });
                result += "</tr>";
            });
            result += "</tbody>";

            result += "</table>";
            return result;
        }

        function Export(htmltable) {
            var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
            excelFile += "<head>";
            excelFile += '<meta http-equiv="Content-type" content="text/html;charset=' + $defaults.encoding + '" />';
            excelFile += "<!--[if gte mso 9]>";
            excelFile += "<xml>";
            excelFile += "<x:ExcelWorkbook>";
            excelFile += "<x:ExcelWorksheets>";
            excelFile += "<x:ExcelWorksheet>";
            excelFile += "<x:Name>";
            excelFile += "{worksheet}";
            excelFile += "</x:Name>";
            excelFile += "<x:WorksheetOptions>";
            excelFile += "<x:DisplayGridlines/>";
            excelFile += "</x:WorksheetOptions>";
            excelFile += "</x:ExcelWorksheet>";
            excelFile += "</x:ExcelWorksheets>";
            excelFile += "</x:ExcelWorkbook>";
            excelFile += "</xml>";
            excelFile += "<![endif]-->";
            excelFile += "</head>";
            excelFile += "<body>";
            excelFile += htmltable.replace(/"/g, '\'');
            excelFile += "</body>";
            excelFile += "</html>";

            var uri = "data:application/vnd.ms-excel;base64,";
            var ctx = { worksheet: $settings.worksheetName, table: htmltable };

            return (uri + base64(format(excelFile, ctx)));
        }

        function base64(s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        }

        function format(s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; });
        }
    };
})($);