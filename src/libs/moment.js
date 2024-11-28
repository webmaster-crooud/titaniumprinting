import moment from "moment-timezone";

export const formatTime = (dateTime) => {
	const result = moment.parseZone(dateTime);
	return moment(result).utcOffset("Asia/Jakarta").format("HH:mm");
};

export const formatUnix = (dateTime) => {
	const result = moment.parseZone(dateTime);
	return moment(result).utcOffset("Asia/Jakarta").unix();
};
