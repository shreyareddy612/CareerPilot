import { Button } from "antd";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApplyJobForm from "../components/ApplyJobForm";
import { useGetAllAvailableJobs } from "../utils/hooks";
import { Card, Avatar } from "antd";
import { store } from "../utils/store";
import Search from "antd/es/input/Search";
import { Loading } from "../components/Loading";
import "./card.css";

const ModelState = {
  off: "off",
  applyJob: "applyJob",
};

Object.freeze(ModelState);

export default function Student() {
  const {
    state: { user },
  } = useContext(store);
  const role = user?.role ? user.role : "";
  const username = user?.userName ? user.userName : "";

  const [searchField, setSearchField] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(ModelState.off);
  const [fetching, setFetching] = useState(true);
  const [allAvailableJobsList, setAllAvailableJobsList] = useState([]);
  const [jobDetails, setJobDetails] = useState({});

  const { Meta } = Card;

  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "Student") {
      console.log("not recruiter");
      navigate("/recruiter");
    }
  }, []);

  useGetAllAvailableJobs(setAllAvailableJobsList, setFetching);

  const handleChange = (e) => {
    setSearchField(e.target.value);
  };

  const filteredData =
    allAvailableJobsList.length === 0
      ? []
      : allAvailableJobsList.filter((person) => {
          return (
            person.company_name
              .toLowerCase()
              .includes(searchField.toLowerCase()) ||
            person.location.toLowerCase().includes(searchField.toLowerCase()) ||
            person.job_title.toLowerCase().includes(searchField.toLowerCase())
          );
        });

  const onAppliedJob = () => {
    setIsModalOpen(ModelState.off);
  };

  return (
    <>
      {role !== "Student" ? (
        <Loading />
      ) : (
        <>
          <div className="card">
            <div className="cardheader">
              <div
                className="headerContent"
                style={{ fontWeight: "bolder", fontSize: "20px" }}
              >
                Available Jobs
              </div>
              <div
                className="rightContent"
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <div>
                  <Search
                    placeholder="search by location, job, compnay"
                    onChange={handleChange}
                    enterButton
                    style={{ width: 350 }}
                  />
                </div>
                <Link
                  to="/appliedJobs"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Applied Jobs
                </Link>
              </div>
            </div>
            <br />
            {filteredData.length === 0 ? (
              <></>
            ) : (
              filteredData.map((job, index) => (
                <Card
                  id={index}
                  hoverable
                  title={<h2>{job.job_title}</h2>}
                  extra={
                    <Meta
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/8.x/initials/svg?seed=${job.company_name}`}
                        />
                      }
                    />
                  }
                  style={{
                    marginTop: 16,
                    background: "#DCE9FA",
                  }}
                  loading={fetching}
                >
                  <div style={{ display: "flex" }}>
                    <p style={{ fontWeight: "bold", marginRight: "6px" }}>
                      Job Description:{" "}
                    </p>
                    <p> {job.job_description}</p>
                  </div>

                  <div style={{ display: "flex", gap: "15rem" }}>
                    <div>
                      <p style={{ fontWeight: "bold" }}>
                        Company:{" "}
                        <span style={{ fontWeight: "500" }}>
                          {job.company_name}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p style={{ fontWeight: "bold" }}>
                        Experinece Required:{" "}
                        <span style={{ fontWeight: "500" }}>
                          {job.experience_required}
                        </span>
                      </p>
                    </div>
                  </div>

                  <p style={{ fontWeight: "bold" }}>
                    Location:{" "}
                    <span style={{ fontWeight: "500" }}>{job.location}</span>
                  </p>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      style={{ background: "#174EA6" }}
                      type="primary"
                      onClick={() => {
                        setJobDetails({
                          Company: job.company_name,
                          JobTitle: job.job_title,
                          PostedBy: job.posted_by,
                        });

                        setIsModalOpen(ModelState.applyJob);
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
          <ApplyJobForm
            isVisible={isModalOpen === ModelState.applyJob}
            onSucessCallback={onAppliedJob}
            onClose={() => setIsModalOpen(ModelState.off)}
            jobDetails={jobDetails}
            username={username}
          />
        </>
      )}
    </>
  );
}
