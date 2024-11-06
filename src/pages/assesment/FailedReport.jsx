import React, { useState, useEffect } from 'react';
import axios from '../../constants/axiosConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactPaginate from 'react-paginate';
import { Eye } from 'lucide-react';
import './assesment.css';
import { images } from '../../assets/images';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function FailedReport() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [submittedStartDate, setSubmittedStartDate] = useState(null);
    const [submittedEndDate, setSubmittedEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const studentsPerPage = 10;

    // Fetch data from the API when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/ai_assessment/failed_report/');
                const apiData = response.data.data.map((item, index) => {
                    const dateObj = new Date(item.dat_created); // Create Date object from ISO string
                    console.log("Raw Date:", item.dat_created); // Debugging line to see what the backend sends
                    console.log("Parsed Date:", dateObj); // Debugging line to see the parsed date
                    return {
                        id: index,
                        name: item.vchr_student_name,
                        reason: item.vchr_reason,
                        pdfLink: item.vchr_file_name,
                        dat_created: dateObj // Store the raw Date object for filtering
                    };
                });
                setData(apiData);
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false); // Set loading to false even if there's an error
            }
        };
        fetchData();
    }, []);

    // Function to parse ISO date to a Date object
    const parseDate = (dateString) => {
        if (!dateString) return null; // Prevent error if dateString is undefined
        const parsedDate = new Date(dateString);
        console.log("Parsing date string:", dateString, "Result:", parsedDate); // Debugging date parsing
        return parsedDate;  // Use JavaScript's Date constructor
    };

    // Filter, sort, and paginate the data
    const filteredData = data
        .filter(student => {
            const studentDate = student.dat_created; // Use the raw Date object

            if (!studentDate) return true; // Skip filtering if date is invalid

            // Ensure submittedStartDate and submittedEndDate are Date objects or null
            if (submittedStartDate && submittedEndDate) {
                console.log("Comparing with range:", submittedStartDate, submittedEndDate);
                return studentDate >= submittedStartDate && studentDate <= submittedEndDate;
            } else if (submittedStartDate) {
                return studentDate >= submittedStartDate;
            } else if (submittedEndDate) {
                return studentDate <= submittedEndDate;
            }
            return true;
        })
        .sort((a, b) => b.dat_created - a.dat_created); // Sort by date, newest first

    const indexOfLastStudent = (currentPage + 1) * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredData.slice(indexOfFirstStudent, indexOfLastStudent);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const pageCount = Math.ceil(filteredData.length / studentsPerPage);

    const handleSubmit = () => {
        console.log("Start date selected:", startDate);
        console.log("End date selected:", endDate);

        // Make sure the start and end dates are set and create new Date objects from them
        setSubmittedStartDate(startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null);  // Set to start of the day
        setSubmittedEndDate(endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null);  // Set to end of the day
        setCurrentPage(0);
    };

    return (
        <div className="tab-view-report max-w-[981px] mx-auto">
            <div className='flex space-x-4 filters'>
                <div className="flex space-x-1 date-filter">
                    <img src={images.CalendorIcon} alt="Calendar Icon" />
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                        dateFormat="dd/MM/yyyy"
                    />
                    -
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="End Date"
                        dateFormat="dd/MM/yyyy"
                    />
                    <button onClick={handleSubmit}>
                        Apply now
                    </button>
                </div>
            </div>

            <div className="view-report-table">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <p>Loading data...</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y">
                        <thead>
                            <tr>
                                <th className="pl-[50px] tracking-wider">Student Name</th>
                                <th className="tracking-wider">Reason</th>
                                <th className="tracking-wider">Assessment File</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentStudents.map((student, index) => (
                                <tr key={index}>
                                    <td className="text-left">{student.name}</td>
                                    <td className="text-center">{student.reason}</td>
                                    <td className="text-center">
                                        <a
                                            href={student.pdfLink}
                                            className="text-blue-600 hover:text-blue-900"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Eye className="inline mr-2 h-4 w-4" /> View
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                <ReactPaginate
                    previousLabel={<ChevronLeft />}
                    nextLabel={<ChevronRight />}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    previousLinkClassName={"pagination__link"}
                    nextLinkClassName={"pagination__link"}
                    disabledClassName={"pagination__link--disabled"}
                    activeClassName={"pagination__link--active"}
                />

            </div>
        </div>
    );
}

export default FailedReport;