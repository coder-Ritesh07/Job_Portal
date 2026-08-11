import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import HomeLandingPage from "./Pages/HomeLandingPage";
import Onboarding from "./Pages/Onboarding";
import JobLists from "./Pages/JobLists";
import Job from "./Pages/Job";
import SavedJobs from "./Pages/SavedJobs";
import PostingJob from "./Pages/PostingJob";
import Myjob from "./Pages/Myjob";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeLandingPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/jobs" element={<JobLists />} />
            <Route path="/jobs/:id" element={<Job />} />
            <Route path="/saved-job" element={<SavedJobs />} />
            <Route path="/post-jobs" element={<PostingJob />} />
            <Route path="/myjobs" element={<Myjob />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
