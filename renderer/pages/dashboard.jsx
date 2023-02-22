import React from "react";
import MainDashboard from "../components/MainDashboard";
import SideDashboard from "../components/SideDashboard";

const dashboard = () => {
	return (
		<div className="flex gap-6">
			<SideDashboard selectedPath={"dashboard"}/>
			<MainDashboard />
		</div>
	);
};

export default dashboard;
