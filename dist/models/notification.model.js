import { Schema, model } from "mongoose";
export var NotificationType;
(function (NotificationType) {
    NotificationType["LIKE"] = "LIKE";
    NotificationType["COMMENT"] = "COMMENT";
    NotificationType["FOLLOW"] = "FOLLOW";
})(NotificationType || (NotificationType = {}));
// KHÔNG extend Document
const notificationSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(NotificationType),
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: null,
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
}, { timestamps: true });
const Notification = model("Notification", notificationSchema);
export default Notification;
