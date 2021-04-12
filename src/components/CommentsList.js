import React from "react";
import "bootstrap/dist/css/bootstrap.css";

const CommentsList = props => {
    return (
        <div>
            <h5 className="text-muted mb-4 text-left">
                <span className="badge badge-success">{props.comments.length}</span>{" "}
                Top Comment{props.comments.length > 0 ? "s" : ""}
            </h5>

            {props.comments.map((comment, index) => (
                <ul className="list-group" key={index}>
                    <li className="list-group-item">
                        <div className="text-left" dangerouslySetInnerHTML={{ __html: comment }}></div>
                    </li>
                </ul>
            ))}
        </div>
    );
}

export default CommentsList;