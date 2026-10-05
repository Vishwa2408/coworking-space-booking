export const formatDateTime = (date) => {
    if (!date) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
};

export const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
    }).format(new Date(date));
};