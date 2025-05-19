package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
	"github.com/gorilla/sessions"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/rs/cors"

	//"github.com/golang-jwt/jwt"
	//	"github.com/gin-gonic/contrib/sessions"
	
	_ "github.com/go-sql-driver/mysql"
	//"golang.org/x/crypto/bcrypt"
)

var db *sql.DB
var err error
var (
	// key must be 16, 24 or 32 bytes long (AES-128, AES-192 or AES-256)
	key   = []byte("super-secret-key")
	store = sessions.NewCookieStore(key)
	
)


var sampleSecretKey = []byte("SecretYouShouldHide12345678901234567890")

type LoginDetails struct {
	UserName string `json:"userName"`
	Password string `json:"password"`
}

type Response struct {
	ResponseCode int
	Respmessage  string
	Data         Data
}

type Data struct {
	JwtToken             string           `json :"jwt_token"`
	JobsList             []JobDetails     `json:"jobs_list"`
	UserName             string           `json:"userName"`
	Role                 string           `json:"role"`
	AppliedJoblist       []AppliedJobData `json:"applied_jobs"`
	ApplieJobsByUserList []ApplyJob       `json:"user_jobs"`
	JobDetailsList       []JobDetails     `json:"posted_jobs_list"`
}

type User struct {
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Username    string `json:"username"`
	Password    string `json:"password"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
	Role        string `json:"role"`
}

type ApplyJob struct {
    Id           int    `json:"id"`
    Username     string `json:"username"`
    JobTitle     string `json:"job_title"`
    CompanyName  string `json:"company_name"`
    Resume       string `json:"resume"`
    PostedBy     string `json:"posted_by"`
}


type JobDetails struct {
	JobTitle            string `json:"job_title"`
	JobDescription      string `json:"job_description"`
	Experience_required string `json:"experience_required"`
	Comapany_name       string `json:"company_name"`
	Location            string `json:"location"`
	BondYears           string `json:"bond_years"`
	PostedBy            string `json:"posted_by"`
}

type AppliedJobData struct {
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	PhoneNumber string `json:"phone_number"`
	Email       string `json:"email"`
	Resume      string `json:"resume"`
	CompanyName string `json:"company_name"`
	JobTitle    string `json:"job_title"`
}

type Claims struct {
	Username string `json:"userName"`
	jwt.StandardClaims
}

func signUp(res http.ResponseWriter, req *http.Request) {
	enableCors(&res)
	var user User
	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		http.Error(res, err.Error(), http.StatusBadRequest)
		return
	}
	var name string
	err = db.QueryRow("SELECT  username FROM golang_stud WHERE username=?", user.Username).Scan(&name)

	if name != "" {
		http.Error(res, "User exists", 500)
		return
	}
	_, err = db.Exec("INSERT INTO golang_stud (username,password,first_name,last_name,email,phone_number,role) VALUES( ?,?,?,?,?,?,?)", user.Username, user.Password, user.FirstName, user.LastName, user.Email, user.PhoneNumber, user.Role)
	if err != nil {
		http.Error(res, err.Error(), http.StatusBadRequest)
		return
	}

	var response Response
	response.ResponseCode = 200
	response.Respmessage = "user successfully registered"
	jsonResp, err := json.Marshal(response)
	// json.NewEncoder(response)
	res.WriteHeader(http.StatusOK)
	res.Write(jsonResp)

}

func login(res http.ResponseWriter, req *http.Request) {
	fmt.Println("Inside login")
	enableCors(&res)
	var loginDet LoginDetails

	res.Header().Set("Content-Type", "application/json")

	err := json.NewDecoder(req.Body).Decode(&loginDet)

	if err != nil {
		http.Error(res, err.Error(), http.StatusBadRequest)
		return
	}

	var userName string
	var password string
	var Role string
	// var resp Response

	//	var user User
	err = db.QueryRow("SELECT userName, password ,role FROM golang_stud WHERE userName=?", loginDet.UserName).Scan(&userName, &password, &Role)
	if err == sql.ErrNoRows {
		var response Response
		response.ResponseCode = 500
		response.Respmessage = "user doesn't exist"

		json.NewEncoder(res).Encode(response)
		http.Error(res, err.Error(), http.StatusBadRequest)

		return

	}

	if password != loginDet.Password {
		var response1 Response
		response1.ResponseCode = 500
		response1.Respmessage = "please enter correct password"

		jsonResp, _ := json.Marshal(response1)
		res.WriteHeader(http.StatusAccepted)
		res.Write(jsonResp)

		return

	}

	expirationTime := time.Now().Add(time.Minute * 30)
	claims := &Claims{Username: loginDet.UserName,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(sampleSecretKey)
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		return
	}
	http.SetCookie(res, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})

	var response Response
	response.ResponseCode = 200
	response.Respmessage = "user login Successful"
	response.Data.JwtToken = tokenString
	response.Data.Role = Role
	jsonResp, err := json.Marshal(response)
	// json.NewEncoder(response)
	res.WriteHeader(http.StatusOK)
	res.Write(jsonResp)

}

func getuserName(tokenString string) string {
	claims := &Claims{}
	jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		return sampleSecretKey, nil
	})

	return claims.Username
}

func isAuth(resp http.ResponseWriter, req *http.Request) {
	enableCors(&resp)

	if req.Header["Token"] != nil {
		tokenString := req.Header["Token"][0]
		UserName := getuserName(tokenString)
		fmt.Println("userName:", UserName)
		var returedName string
		var role string
		err = db.QueryRow("SELECT username,role  FROM golang_stud WHERE username=?", UserName).Scan(&returedName, &role)
		if returedName != "" {
			var response Response
			response.Data.UserName = UserName
			response.Data.Role = role
			response.ResponseCode = 200
			response.Respmessage = "Authorised"
			jsonResp, _ := json.Marshal(response)
			resp.Write(jsonResp)
			resp.WriteHeader(http.StatusOK)
			return
		}

		resp.WriteHeader(http.StatusUnauthorized)
		return
	}
	resp.WriteHeader(http.StatusUnauthorized)
}
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Content-Type", "application/json")
	(*w).Header().Set("Access-Control-Allow-Origin", "https://localhost:3000")
}

func addJob(resp http.ResponseWriter, req *http.Request) {
	enableCors(&resp)
	var jobDet JobDetails
	resp.Header().Set("Content-Type", "application/json")

	err := json.NewDecoder(req.Body).Decode(&jobDet)
	if err != nil {
		resp.WriteHeader(http.StatusFailedDependency)
		return
	}

	_, err = db.Exec("INSERT INTO available_jobs (job_title,job_description,experience_required,company_name,location,bond_years,posted_by) VALUES(?,?,?,?,?,?,?)", jobDet.JobTitle, jobDet.JobDescription, jobDet.Experience_required, jobDet.Comapany_name, jobDet.Location, jobDet.BondYears, jobDet.PostedBy)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	var response Response
	response.ResponseCode = 200
	response.Respmessage = "Job details added successfully"

	jsonResp, err := json.Marshal(response)
	// json.NewEncoder(response)
	resp.WriteHeader(http.StatusOK)
	resp.Write(jsonResp)

}

func getAllJobs(resp http.ResponseWriter, req *http.Request) {
	enableCors(&resp)

	var ResponseReturn Response
	resp.Header().Set("Content-Type", "application/json")
	rows, _ := db.Query("SELECT job_title , job_description, experience_required, company_name, location, bond_years ,posted_by from available_jobs ")
	for rows.Next() {
		var jobDet JobDetails
		err := rows.Scan(&jobDet.JobTitle, &jobDet.JobDescription, &jobDet.Experience_required, &jobDet.Comapany_name, &jobDet.Location, &jobDet.BondYears, &jobDet.PostedBy)
		if err != nil {
			resp.WriteHeader(http.StatusBadRequest)
			return
		}
		ResponseReturn.Data.JobsList = append(ResponseReturn.Data.JobsList, jobDet)
	}

	ResponseReturn.Respmessage = "Jobs list"
	ResponseReturn.ResponseCode = 200
	resp.WriteHeader(http.StatusOK)
	jsonResp, _ := json.Marshal(ResponseReturn)
	resp.Write(jsonResp)

}

func getAllAppliedJobsPerRecuiter(resp http.ResponseWriter, req *http.Request) {
	enableCors(&resp)
	var ResponseReturn Response
	var user LoginDetails

	resp.Header().Set("Content-Type", "application/json")

	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	rows, err := db.Query(`
		SELECT gs.first_name, gs.last_name, gs.email, gs.phone_number,
			   aj.company_name, aj.job_title, aj.resume
		FROM golang_stud gs
		JOIN applied_jobs1 aj ON gs.username = aj.username
		WHERE aj.posted_by = ?`, user.UserName)

	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		return
	}

	for rows.Next() {
		var appliedJobData AppliedJobData
		err := rows.Scan(
			&appliedJobData.FirstName,
			&appliedJobData.LastName,
			&appliedJobData.Email,
			&appliedJobData.PhoneNumber,
			&appliedJobData.CompanyName,
			&appliedJobData.JobTitle,
			&appliedJobData.Resume,
		)
		if err != nil {
			http.Error(resp, err.Error(), http.StatusBadRequest)
			return
		}
		ResponseReturn.Data.AppliedJoblist = append(ResponseReturn.Data.AppliedJoblist, appliedJobData)
	}

	ResponseReturn.ResponseCode = 200
	ResponseReturn.Respmessage = "Fetched applicants"
	jsonResp, _ := json.Marshal(ResponseReturn)
	resp.WriteHeader(http.StatusOK)
	resp.Write(jsonResp)
}

func applyJob(resp http.ResponseWriter, req *http.Request) {
	enableCors(&resp)
	fmt.Printf("apply job called")
	var user ApplyJob
	var response Response
	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}

	if user.Username != "" && user.CompanyName != "" {
		var userName string
		err = db.QueryRow("SELECT username  FROM applied_jobs1 WHERE username=?  and  companyName =? and  jobTitle=?", user.Username, user.CompanyName, user.JobTitle).Scan(&userName)
		var jsonResp []byte
		if userName == "" {
			_, err = db.Exec("INSERT INTO applied_jobs1(id,username,job_title,company_name,resume,posted_by) VALUES((SELECT MAX( id )+1 FROM applied_jobs1 jobs),?,?,?,?,?)", user.Username, user.JobTitle, user.CompanyName, user.Resume, user.PostedBy)
			if err != nil {
				http.Error(resp, err.Error(), http.StatusBadRequest)
				return
			}
			response.ResponseCode = 200
			response.Respmessage = "Job details added successfully"
			jsonResp, _ = json.Marshal(response)

		} else {
			response.ResponseCode = 201
			response.Respmessage = "user already applied for the job"

			jsonResp, _ = json.Marshal(response)

		}
		resp.WriteHeader(http.StatusOK)
		resp.Write(jsonResp)
		return
	}
	resp.WriteHeader(http.StatusBadRequest)
}

func getJobsAppliedByUser(resp http.ResponseWriter, req *http.Request) {
	enableCors(&resp)
	var user LoginDetails
	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}
	var ResponseReturn Response
	rows, _ := db.Query("SELECT id, username, job_title, company_name, resume, posted_by FROM applied_jobs1 WHERE username = ?", user.UserName)

	for rows.Next() {
		var appliedJobData ApplyJob
err := rows.Scan(
    &appliedJobData.Id,
    &appliedJobData.Username,
    &appliedJobData.JobTitle,
    &appliedJobData.CompanyName,
    &appliedJobData.Resume,
    &appliedJobData.PostedBy,
)

		if err != nil {
			resp.WriteHeader(http.StatusBadRequest)
			return
		}
		ResponseReturn.Data.ApplieJobsByUserList = append(ResponseReturn.Data.ApplieJobsByUserList, appliedJobData)
	}

	ResponseReturn.Respmessage = "applied Jobs list"
	ResponseReturn.ResponseCode = 200
	resp.WriteHeader(http.StatusOK)
	jsonResp, _ := json.Marshal(ResponseReturn)
	resp.Write(jsonResp)

}
func getJobPostedByRecruiter(resp http.ResponseWriter, req *http.Request) {
	fmt.Print("getjob")
	enableCors(&resp)
	var user LoginDetails
	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusBadRequest)
		return
	}
	
	var ResponseReturn Response
	rows, err := db.Query("SELECT * FROM available_jobs WHERE posted_by = ?", user.UserName)
	if err != nil {
		// Log or handle the error
		fmt.Println("Error executing SQL query:", err)
		http.Error(resp, "Error fetching data", http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	for rows.Next() {
		var jobDet JobDetails
		var id, extra1, extra2 string // Placeholder variables for extra columns
		err := rows.Scan(&id, &jobDet.JobTitle, &jobDet.JobDescription, &jobDet.Experience_required, &jobDet.Comapany_name, &jobDet.Location, &jobDet.BondYears, &jobDet.PostedBy, &extra1, &extra2)
		if err != nil {
			// Log or handle the error
			fmt.Println("Error scanning row:", err)
			resp.WriteHeader(http.StatusBadRequest)
			return
		}
		// Optionally, you can use the blank identifier `_` for the extra columns if you don't need their values
		//err := rows.Scan(&id, &jobDet.JobTitle, &jobDet.JobDescription, &jobDet.Experience_required, &jobDet.Comapany_name, &jobDet.Location, &jobDet.BondYears, &jobDet.PostedBy, _, _)

		ResponseReturn.Data.JobDetailsList = append(ResponseReturn.Data.JobDetailsList, jobDet)
	}

	ResponseReturn.Respmessage = "applied Jobs list"
	ResponseReturn.ResponseCode = 200
	resp.WriteHeader(http.StatusOK)
	jsonResp, _ := json.Marshal(ResponseReturn)
	resp.Write(jsonResp)
}

// err := rows.StructScan(&place)
//
//	if err != nil {
//		log.Fatalln(err)
//	}
func hi(resp http.ResponseWriter, req *http.Request) {
	resp.WriteHeader(http.StatusOK)
}

func main() {
	db, err = sql.Open("mysql", "Hemanthborra:Hemanth@4444@tcp(127.0.0.1:3306)/job_portal")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err.Error())
	}
	fmt.Printf("hello")
	//handler := cors.Default().Handler(mux)
	r := mux.NewRouter()
	r.HandleFunc("/login", login).Methods("POST")
	r.HandleFunc("/isAuthorized", isAuth)
	r.HandleFunc("/signup", signUp).Methods("POST")
	r.HandleFunc("/addJobDetails", addJob).Methods("POST")
	r.HandleFunc("/getAllJobsList", getAllJobs)
	r.HandleFunc("/appliedApplicants", getAllAppliedJobsPerRecuiter)
	r.HandleFunc("/getJobPostedByRecruiter", getJobPostedByRecruiter)
	r.HandleFunc("/applyJob", applyJob).Methods("POST")
	r.HandleFunc("/getJobsAppliedByUser", getJobsAppliedByUser)
	r.HandleFunc("/hi", hi)
	c := cors.New(cors.Options{
		AllowedMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut},
		AllowedOrigins: []string{"*"},

		AllowCredentials: true,
	})
	fmt.Printf("start")
	// headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	// originsOk := handlers.AllowedOrigins([]string{os.Getenv("ORIGIN_ALLOWED")})
	// methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	handler := c.Handler(r)
	//log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), handlers.CORS(originsOk, headersOk, methodsOk)(r)))
	log.Fatal(http.ListenAndServe(":8080", handler))

	// log.Fatal(http.ListenAndServe(":3000", handler)
}
