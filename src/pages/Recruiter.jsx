import { Button } from "antd";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddPostForm from "../components/AddPostForm";
import { useGetPostedJobsByRecruiter } from "../utils/hooks";
import { Card, Avatar } from "antd";
import { store } from "../utils/store";
import { Loading } from "../components/Loading";

const ModelState = {
  off: "off",
  addPost: "addPost",
};

Object.freeze(ModelState);

export default function Recruiter() {
  const {
    state: { user },
  } = useContext(store);
  const username = user?.userName ? user.userName : "";
  const role = user?.role ? user.role : "";

  const [isModalOpen, setIsModalOpen] = useState(ModelState.off);
  const [fetching, setFetching] = useState(true);
  const [postedJobs, setPostedJobs] = useState([]);

  const { Meta } = Card;

  const navigate = useNavigate();
  useEffect(() => {
    if (role !== "Recruiter") {
      console.log("not recruiter");
      navigate("/student");
    }
  }, []);

  useGetPostedJobsByRecruiter(setPostedJobs, setFetching, username);

  const onCreateJob = () => {
    setIsModalOpen(ModelState.off);
  };

  return (
    <>
      {role !== "Recruiter" ? (
        <Loading />
      ) : (
        <>
          <div className="card">
            <div className="cardheader">
              <div
                className="headerContent"
                style={{ fontWeight: "bolder", fontSize: "20px" }}
              >
                Posted Jobs
              </div>
              <div className="rightContent">
                <Link
                  to="/appliedApplicants"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Applied Applicants
                </Link>
                <Button
                style={{background:"#174EA6"}}
                  type="primary"
                  shape="round"
                  onClick={() =>
                    setIsModalOpen(ModelState.addPost) && setIsModalOpen(true)
                  }
                >
                  Add Job
                </Button>
              </div>
            </div>
            <br />
            {postedJobs.map((job) => (
              <Card
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
                style={{ marginTop: 16,background: "#DCE9FA", }}
                loading={fetching}
              >
                <div style={{ display: "flex" }}>
                  <p style={{ fontWeight: "bold", marginRight: "6px" }}>
                    Job Description:{" "}
                  </p>
                  <p> {job.job_description}</p>
                </div>
                <div style={{ display: "flex", gap: "15rem" }}>
                  <p style={{ fontWeight: "bold" }}>
                    Experinece Required:{" "}
                    <span style={{ fontWeight: "450" }}>
                      {job.experience_required}
                    </span>
                  </p>
                  <p style={{ fontWeight: "bold" }}>
                    Bond Years:{" "}
                    <span style={{ fontWeight: "450" }}>{job.bond_years}</span>
                  </p>
                </div>
                <p style={{ fontWeight: "bold" }}>
                  Company Name:{" "}
                  <span style={{ fontWeight: "450" }}>{job.company_name}</span>
                </p>
              </Card>
            ))}
          </div>
          <AddPostForm
            isVisible={isModalOpen === ModelState.addPost}
            onSucessCallback={onCreateJob}
            onClose={() => setIsModalOpen(ModelState.off)}
            username={username}
          />
        </>
      )}
    </>
  );
}
