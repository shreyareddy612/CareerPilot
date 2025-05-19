import { useContext, useEffect } from "react";
import axios from 'axios';
import {
  authhandler,
  getAllAvailableJobs,
  getAppliedJobs,
  getPostedJobsByRecruiter,
  getappliedApplicants,
} from "./functions";
import { store } from "./store";
import ActionTypes from "./type";

export const useAuth = ({ errorCallBack, successCallBack }) => {
  const { dispatch } = useContext(store);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authhandler();
        console.log("Authenticated user from backend:", user);
        if (!user) {
          if (errorCallBack) errorCallBack();
          return;
        }
        dispatch({ type: ActionTypes.UPDATE_USER_INFO, payload: user });
        if (successCallBack) successCallBack();
      } catch (err) {
        console.error("Auth error:", err);
        if (errorCallBack) errorCallBack();
      }
    };
    checkUser();
  }, [dispatch, errorCallBack, successCallBack]);
};

export const useGetAppliedApplicants = (setAppliedApplicants, setFetching, username) => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post("http://localhost:8080/appliedApplicants", {
            userName: username
          });
          setAppliedApplicants(response.data.data.applied_jobs || []);
        } catch (error) {
          console.error("Error fetching applied applicants:", error);
        } finally {
          setFetching(false);
        }
      };
  
      if (username) fetchData();
    }, [username]);
  };
  
export const useGetAllAvailableJobs = (setAllAppliedJobs, setFetching) => {
  useEffect(() => {
    getAllAvailableJobs(setAllAppliedJobs, setFetching);
  }, [setAllAppliedJobs, setFetching]);
};

export const useGetPostedJobsByRecruiter = (setInventories, setFetching, username) => {
  useEffect(() => {
    console.log("Inside useGetPostedJobsByRecruiter. Username:", username);
    if (username) {
      getPostedJobsByRecruiter(setInventories, setFetching, username);
    } else {
      console.warn("useGetPostedJobsByRecruiter skipped: username is undefined or empty.");
    }
  }, [username, setInventories, setFetching]);
};

export const useGetAppliedJobs = (setAppliedJobs, setFetching, username) => {
  useEffect(() => {
    console.log("Inside useGetAppliedJobs. Username:", username);
    if (username) {
      getAppliedJobs(setAppliedJobs, setFetching, username);
    } else {
      console.warn("useGetAppliedJobs skipped: username is undefined or empty.");
    }
  }, [username, setAppliedJobs, setFetching]);
};
