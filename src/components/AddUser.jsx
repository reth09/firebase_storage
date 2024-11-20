import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseconfig";

function AddUser() {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId === "") {
        await addDoc(collection(db, "user"), user);
        console.log("User added successfully");
      } else {
        await updateDoc(doc(db, "user", editId), {
          email: user.email,
          password: user.password,
        });
        console.log("User updated successfully");
        setEditId("");
      }
    } catch (error) {
      console.log(error);
    }
    setUser({});
    getData();
  };

  const getData = async () => {
    try {
      const res = await getDocs(collection(db, "user"));
      const allData = res.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(allData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "user", id));
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (user) => {
    setUser(user);
    setEditId(user.id);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-light text-center">
                <h5 className="mb-0">{editId ? "Edit User" : "Add User"}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={user.email || ""}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={user.password || ""}
                      onChange={handleChange}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      {editId ? "Update User" : "Add User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h4 className="text-center mb-3">User List</h4>
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm me-2"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddUser;
