import React from 'react';
import { Table } from 'react-bootstrap';

const UserList = ({ users }) => (
  <Table striped bordered hover className="mt-4">
    <thead>
      <tr>
        <th>ФИО</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user._id}>
          <td>{user.fullName}</td>
          <td>{user.email}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default UserList;
