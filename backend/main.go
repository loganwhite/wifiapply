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
	Data      struct{}
}

//indexpage show up the index page
func indexPage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("method:", r.Method) //获取请求的方法

	if r.Method == "GET" {
		t, _ := template.ParseFiles("pages/index.html")
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

		fmt.Print(mobile)

		db, err := sql.Open("mysql", "")
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

func main() {

	fs := http.FileServer(http.Dir("./pages/static"))
	http.Handle("/static/", http.StripPrefix("/static", fs))

	http.HandleFunc("/", indexPage)
	http.HandleFunc("/submit", submitApply)

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
