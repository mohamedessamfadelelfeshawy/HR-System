/* fetch employee */

export const fetchEmployee = async (link) => {
    try {
        const res = await fetch(link);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching employee data:", err);
    }
};
