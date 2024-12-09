import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    let { user } = useContext(AuthContext);

    return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;