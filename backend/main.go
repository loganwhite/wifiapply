package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	//"strings"
)

//ResData the return struct of a single request
type ResData struct {
	IsSuccess bool
	Msg       string
	Data      interface{}
}

//ApplyData the struct of t_apply
type ApplyData struct {
	Id            int64  `json:"id"`
	Name          string `json:"name"`
	Stuno         string `json:"stuno"`
	Department    string `json:"department"`
	Room          string `json:"room"`
	Center        string `json:"center"`
	Tuitor        string `json:"tuitor"`
	Email         string `json:"email"`
	Mobile        string `json:"mobile"`
	IsDistributed bool   `json:"isdistributed"`
}

var dburl = ""
var defaultusername = ""
var defaultpassword = ""

//indexpage show up the index page
func indexPage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("method:", r.Method) //获取请求的方法

	if r.Method == "GET" {
		t, _ := template.ParseFiles("pages/index.html")
		log.Println(t.Execute(w, nil))
	}
}

//managepage show up the index page
func managePage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("method:", r.Method) //获取请求的方法

	if r.Method == "GET" {
		t, _ := template.ParseFiles("pages/manage.html")
		log.Println(t.Execute(w, nil))
	}
}

func submitApply(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var res ResData

		name := r.FormValue("name")
		stuno := r.FormValue("stuno")
		room := r.FormValue("room")
		department := r.FormValue("school")
		center := r.FormValue("center")
		tuitor := r.FormValue("tuitor")
		email := r.FormValue("email")
		mobile := r.FormValue("mobile")
		wantdomain1 := r.FormValue("wantdomain1")
		wantdomain2 := r.FormValue("wantdomain2")
		wantdomain3 := r.FormValue("wantdomain3")

		db, err := sql.Open("mysql", dburl)
		checkErr(err)
		defer db.Close()
		defer func(ret *ResData, w http.ResponseWriter) {
			b, _ := json.Marshal(*ret)
			fmt.Print(string(b))
			fmt.Fprint(w, string(b))
		}(&res, w)

		exist := 0

		//check apply exist
		err = db.QueryRow("select 1 from t_apply where stuno=? or room=?", stuno, room).Scan(&exist)
		//checkErr(err)
		if !(sql.ErrNoRows == err || exist <= 0) {
			res.IsSuccess = false
			res.Msg = "不好意思,存在申请记录!"
			return
		}

		stmt, err := db.Prepare("INSERT t_apply SET name=?,stuno=?,room=?,department=?,center=?,tuitor=?,email=?,mobile=?,apply_time=?,wantdomain1=?,wantdomain2=?,wantdomain3=?")
		checkErr(err)

		applyTime := time.Now().Unix()
		sqlRes, err := stmt.Exec(name, stuno, room, department, center, tuitor, email, mobile, applyTime, wantdomain1, wantdomain2, wantdomain3)
		checkErr(err)

		affect, err := sqlRes.RowsAffected()
		checkErr(err)

		if affect != 1 {
			res.IsSuccess = false
			res.Msg = "不好意思,数据库插入好像有点问题!"
			return
		}

		res.IsSuccess = true
		res.Msg = "申请成功, 请耐心等待小黑发放!"
	}
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var res ResData

		username := r.FormValue("username")
		password := r.FormValue("password")

		fmt.Printf("%s %s\n", username, password)

		defer func(ret *ResData, w http.ResponseWriter) {
			b, _ := json.Marshal(*ret)
			fmt.Print(string(b))
			fmt.Fprint(w, string(b))
		}(&res, w)

		if username == defaultusername && password == defaultpassword {
			res.IsSuccess = true
			res.Msg = "登录成功"
		} else {
			res.IsSuccess = false
			res.Msg = "用户名或密码不对"
		}

	}
}

func handleList(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		var res ResData

		db, err := sql.Open("mysql", dburl)
		checkErr(err)

		defer db.Close()
		defer func(ret *ResData, w http.ResponseWriter) {
			b, _ := json.Marshal(*ret)
			fmt.Print(string(b))
			fmt.Fprint(w, string(b))
		}(&res, w)

		rows, err := db.Query("SELECT id, name, stuno, department, room, tuitor, center, email, mobile, isdistributed from t_apply")
		checkErr(err)

		if sql.ErrNoRows == err || err != nil {
			res.IsSuccess = false
			res.Msg = "没有申请记录或服务器端有问题!"
			return
		}

		data := []ApplyData{}
		item := ApplyData{}

		for rows.Next() {
			var id int64
			var name, stuno, department, room, tuitor, center, email, mobile string
			var isdistributed bool
			rows.Scan(&id, &name, &stuno, &department, &room, &tuitor, &center, &email, &mobile, &isdistributed)
			item.Id = id
			item.Name = name
			item.Stuno = stuno
			item.Department = department
			item.Room = room
			item.Tuitor = tuitor
			item.Center = center
			item.Email = email
			item.Mobile = mobile
			item.IsDistributed = isdistributed
			data = append(data, item)
		}

		res.IsSuccess = true
		res.Msg = "成功"
		res.Data = data
	}
}

func handleDistribute(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		id := r.FormValue("id")

		var res ResData

		db, err := sql.Open("mysql", dburl)
		checkErr(err)

		defer db.Close()
		defer func(ret *ResData, w http.ResponseWriter) {
			b, _ := json.Marshal(*ret)
			fmt.Print(string(b))
			fmt.Fprint(w, string(b))
		}(&res, w)

		stmt, err := db.Prepare("update t_apply set isdistributed=? where id=?")
		checkErr(err)

		result, err := stmt.Exec(1, id)
		checkErr(err)

		affect, err := result.RowsAffected()
		checkErr(err)

		if affect != 1 {
			res.IsSuccess = false
			res.Msg = "处理失败!"
			return
		}
		res.IsSuccess = true
		res.Msg = "处理成功!"

	}
}

func handleOutofstock(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "没有库存了，请稍等几日!")
}

func main() {

	fs := http.FileServer(http.Dir("./pages/static"))
	http.Handle("/static/", http.StripPrefix("/static", fs))

	http.HandleFunc("/", indexPage)
	http.HandleFunc("/outofstock", handleOutofstock)
	http.HandleFunc("/submit", submitApply)
	http.HandleFunc("/manage", managePage)

	http.HandleFunc("/login", handleLogin)
	http.HandleFunc("/list", handleList)
	http.HandleFunc("/distribute", handleDistribute)

	err := http.ListenAndServe(":9000", nil) //设置监听的端口
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
