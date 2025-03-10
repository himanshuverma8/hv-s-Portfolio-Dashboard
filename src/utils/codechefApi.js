import axios from "axios";

export default async function fetchCodechefStats(handle) {
    try {
        const response = await axios.get(`https://codechef-api.vercel.app/handle/${handle}`);
        const data = response.data; // Extracting actual data
        const maxRating = `${data.highestRating}  (${data.stars})`;

        // Check if ratingData exists and has contests
        if (!data.ratingData || data.ratingData.length === 0) {
            throw new Error("No contest data available");
        }

        // Find the last contest based on the latest `end_date`
        const lastContest = data.ratingData.reduce((latest, contest) => 
            new Date(contest.end_date) > new Date(latest.end_date) ? contest : latest
        , data.ratingData[0]);

        // Find the best rank and its contest
        const bestRankContest = data.ratingData.reduce((best, contest) => 
            parseInt(contest.rank) < parseInt(best.rank) ? contest : best
        , data.ratingData[0]);

        console.log(data);

        return {
            maxRating,
            lastContest: lastContest.name,
            bestRankWithContest: `${bestRankContest.rank} | ${bestRankContest.name}`
        };

    } catch (error) {
        console.error("Error fetching CodeChef data:", error.message);
        return null;
    }
}
