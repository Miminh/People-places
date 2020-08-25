import React from "react";
import "./UserList.css";

import UserItem from "./UserItem";

const UserList = (props) => {
  if (props.items.length === 0) {
    return <div className="center">No Places Found</div>;
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => {
        return (
          <li key={user.id}>
            <UserItem
              id={user.id}
              image={user.image}
              name={user.name}
              placeCount={user.places.length}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default UserList;
