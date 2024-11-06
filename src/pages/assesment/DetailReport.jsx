import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './assesment.css';
import axios from '../../constants/axiosConfig';
import { images } from '../../assets/images';
import { Modal } from "flowbite-react";

function DetailReport() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const itemsPerPage = 10;

    // State for filter inputs
    const [courseInput, setCourseInput] = useState('');
    const [moduleMonthInput, setModuleMonthInput] = useState(null);

    // State for applied filters
    const [appliedFilters, setAppliedFilters] = useState({
        startDate: null,
        endDate: null,
        course: '',
        moduleMonth: null
    });

    // Fetch data from API and parse dates into Date objects
    const fetchData = async () => {
        try {
            const response = await axios.get('/ai_assessment/detailed_assessment_report/');
            console.log("response dth",response)
            const fetchedData = response.data.data.map((item, index) => {
                const dateObj = new Date(item.dat_evaluation);
                const moduleMonth = new Date(item.module_month);
                console.log(index,moduleMonth)

                return {
                    id: index,
                    course: item.vchr_course_name,
                    module: item.vchr_module_name,
                    module_month: moduleMonth,
                    faculty: item.vchr_faculty_name,
                    dateOfEvaluation: dateObj,
                    studentsCount: item.int_assessment_count,
                    students: item.details.map(detail => ({
                        name: detail.vchr_student_name,
                        score: detail.vchr_final_score
                    }))
                };
            });
            setData(fetchedData);
            setFilteredData(fetchedData);

            // Extract unique courses
            const uniqueCourses = [...new Set(fetchedData.map(item => item.course))];
            setCourses(uniqueCourses);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Apply filters
    const applyFilters = () => {
        const filtered = data.filter(entry => {
            let dateFilter = true;
            if (appliedFilters.startDate && appliedFilters.endDate) {
                dateFilter = entry.dateOfEvaluation >= appliedFilters.startDate && entry.dateOfEvaluation <= appliedFilters.endDate;
            } else if (appliedFilters.startDate) {
                dateFilter = entry.dateOfEvaluation >= appliedFilters.startDate;
            } else if (appliedFilters.endDate) {
                dateFilter = entry.dateOfEvaluation <= appliedFilters.endDate;
            }

            const courseFilter = appliedFilters.course ? entry.course === appliedFilters.course : true;
            const moduleMonthFilter = appliedFilters.moduleMonth ?
                entry.module_month.getMonth() === appliedFilters.moduleMonth.getMonth() &&
                entry.module_month.getFullYear() === appliedFilters.moduleMonth.getFullYear() : true;

            return dateFilter && courseFilter && moduleMonthFilter;
        })
            .sort((a, b) => b.dateOfEvaluation - a.dateOfEvaluation);

        setFilteredData(filtered);
        setCurrentPage(0);
    };

    useEffect(() => {
        applyFilters();
    }, [appliedFilters]);

    const handleSubmit = () => {
        setAppliedFilters({
            startDate,
            endDate,
            course: courseInput,
            moduleMonth: moduleMonthInput
        });
    };

    const indexOfLastEntry = (currentPage + 1) * itemsPerPage;
    const indexOfFirstEntry = indexOfLastEntry - itemsPerPage;
    const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="tab-view-report max-w-[1040px] mx-auto">
            <div className="flex space-x-4 filters">
                <div className="flex space-x-1 date-filter">
                    <img src={images.CalendorIcon} alt="" />
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

                    <select
                        value={courseInput}
                        onChange={(e) => setCourseInput(e.target.value)}
                        className="course-filter"
                    >
                        <option value="">All Courses</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course}>{course}</option>
                        ))}
                    </select>
                    <DatePicker
                        selected={moduleMonthInput}
                        onChange={(date) => setModuleMonthInput(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        placeholderText="Select Module Month"
                        className="module-month-filter"
                    />
                    <button onClick={handleSubmit} className="apply-filter-btn">
                        Apply Filters
                    </button>
                </div>


            </div>

            <div className="view-report-table overflow-x-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <p>Loading data...</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left">Course Name</th>
                                <th className="text-left">Module Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty Name</th>
                                <th className="text-center">List of Students</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Evaluation</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentEntries.map((entry) => (
                                <tr key={entry.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.course}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.module}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.faculty}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center justify-center">
                                            <span className="inline-flex text-count items-center justify-center">{entry.studentsCount}</span>
                                            <button
                                                className='eyeicon'
                                                onClick={() => {
                                                    setSelectedStudent(entry.students);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                <img src={images.EyeIcon} alt="" /> view
                                            </button>
                                        </div>
                                    </td>
                                    <td className="text-center">{formatDate(entry.dateOfEvaluation)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

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

                <Modal dismissible show={openModal} onClose={() => setOpenModal(false)} className='modal-bdy'>
                    <Modal.Body>
                        {selectedStudent ? (
                            <div>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100 text-left">
                                            <th className="text-center">NO</th>
                                            <th className="text-center">Student name</th>
                                            <th className="text-center">Final Score</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedStudent.map((student, index) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-center">{student.name}</td>
                                                <td className="text-center">{student.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No student data available</p>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

export default DetailReport;