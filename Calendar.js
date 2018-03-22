/*

    config = {
        year: Date,
        fn: When date is changed fn will be called -> fn(Date);
        element: Parent DOM element (If no element is is provided, use getElement to get view DOM element);
        classList: { (Optional with defaults, type is all string)
            year: 'year',
            month: 'month',
            weeks: 'weeks',
            dayWrapper: 'day-wrapper',
            day: 'day',
            yearBackButton: 'year-back',
            yearNextButton: 'year-next',
            yearLabel: 'year-label',
            monthBackButton: 'month-back',
            monthNextButton: 'month-next',
            monthLabel: 'month-label'
        },
        text: { (Optional with defaults, type is all string)
            back: '<',
            next: '>'
        }
    }

*/
function Calendar(config) {
    // Private
    let date;
    let fn; 
    let element;

    let selectedDate;
    let selectedDay;

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]

    const text = {
        back: '<',
        next: '>'
    };
    
    // Defaults and declaration & initialization
    const classList = { 
        year: 'year',
        month: 'month',
        weeks: 'weeks',
        dayWrapper: 'day-wrapper',
        day: 'day',
        yearBackButton: 'year-back',
        yearNextButton: 'year-next',
        yearLabel: 'year-label',
        monthBackButton: 'month-back',
        monthNextButton: 'month-next',
        monthLabel: 'month-label',
        dayLabel: 'day-label',
    };
    
    // Declaration
    const components = { 
        year: null,
        month: null,
        weeks: null,
        yearBackButton: null,
        yearNextButton: null,
        monthBackButton: null,
        monthNextButton: null,
        yearLabel: null,
        monthLabel: null,
        dayLabel: null,
        days: []
    };

    const createElement = () => {
        const el = document.createElement('div');

        return el;
    }

    const createViewComponents = () => {
        components.year = document.createElement('div');
        components.yearBackButton = document.createElement('button');
        components.yearNextButton = document.createElement('button');
        components.yearLabel = document.createElement('div');
        components.dayLabel = document.createElement('div');

        components.yearBackButton.innerHTML = text.back;
        components.yearNextButton.innerHTML = text.next;

        components.month = document.createElement('div');
        components.monthBackButton = document.createElement('button');
        components.monthNextButton = document.createElement('button');
        components.monthLabel = document.createElement('div');

        components.monthBackButton.innerHTML = text.back;
        components.monthNextButton.innerHTML = text.next;

        components.weeks = document.createElement('div');

        components.year.classList.add(classList.year);
        components.yearBackButton.classList.add(classList.yearBackButton);
        components.yearNextButton.classList.add(classList.yearNextButton);
        components.yearLabel.classList.add(classList.yearLabel);
        components.dayLabel.classList.add(classList.dayLabel);

        components.month.classList.add(classList.month);
        components.monthBackButton.classList.add(classList.monthBackButton);
        components.monthNextButton.classList.add(classList.monthNextButton);
        components.monthLabel.classList.add(classList.monthLabel);

        components.weeks.classList.add(classList.weeks);
        
        element.appendChild(components.year);
        components.year.appendChild(components.yearLabel);
        components.year.appendChild(components.yearBackButton);
        components.year.appendChild(components.yearNextButton);

        element.appendChild(components.month);
        components.month.appendChild(components.monthLabel);
        components.month.appendChild(components.monthBackButton);
        components.month.appendChild(components.monthNextButton);
        
        element.appendChild(components.dayLabel);
        
        for (let i = 1; i <= 7; i++) {
            const day = document.createElement('div');
            
            day.innerHTML = dayNames[i - 1][0];
            day.id = dayNames[i - 1];

            components.dayLabel.appendChild(day);
        }

        element.appendChild(components.weeks);

        dateChanged();
    }

    const yearBack = () => {
        date.setYear(date.getFullYear() - 1);

        dateChanged();
    }

    const yearNext = () => {
        date.setYear(date.getFullYear() + 1);
        
        dateChanged();
    }

    const monthBack = () => {
        date.setMonth(date.getMonth() - 1);

        dateChanged();
    }

    const monthNext = () => {
        date.setMonth(date.getMonth() + 1);

        dateChanged();
    }
    const selectDay = (day) => {
        if(selectedDay) {
            selectedDay.classList.remove('selected');
        }

        selectedDay = day;
        selectedDate = new Date(date.getFullYear(), date.getMonth(), day.$id);
        selectedDay.classList.add('selected');
    }

    const checkIfDaySelected = (id) => {
        if(!selectedDate) {
            return false;
        }
        
        if(date.getFullYear() === selectedDate.getFullYear() && date.getMonth() === selectedDate.getMonth() && id === selectedDate.getDate()) {
            return true;
        }

        return false;
    }

    const dayClicked = (e) => {
        const day = e.currentTarget;

        if(!checkIfDaySelected(day.$id)) {
            selectDay(day);
        }
    }

    const dateChanged = () => {
        components.yearLabel.innerHTML = date.getFullYear();
        components.monthLabel.innerHTML = months[date.getMonth()];

        recreateDays();
    }

    
    const removeDays = () => {
        components.days.forEach((day) => {
            components.weeks.removeChild(day);
        });
        
        components.days = [];
    }
    
    const createDay = (i, x) => {
        const dayWrapper = document.createElement('div');
        const day = document.createElement('div');
        
        day.classList.add(classList.day);
        dayWrapper.classList.add(classList.dayWrapper);

        day.innerHTML = !!i ? i : x + 1;
        dayWrapper.$id = !!i ? i : x;


        !!i ? null : dayWrapper.classList.add('previous');

        if(isCurrentDay(i, date.getMonth())) {
            dayWrapper.classList.add('active');
        }
        
        if(checkIfDaySelected(i)) {
            selectDay(dayWrapper);
        }
        
        dayWrapper.appendChild(day);
        dayWrapper.addEventListener('click', dayClicked);
        
        return dayWrapper;
    }
    
    const isCurrentDay = (day, month) => {
        const d = new Date();
        
        return d.getDate() === day && d.getMonth() === month;
    }
    
    const getDaysInMonth = (date) => {
        return 32 - new Date(date.getFullYear(), date.getMonth(), 32).getDate();
    }

    const getStartingDay = date => {
        return date.getDay(date);
    }

    const recreateDays = () => {
        removeDays();
        
        const days = getDaysInMonth(date);
        const startingDay = getStartingDay(date);

        for (let i = startingDay; i > 0; i--) {
            let prevDays = 32 - new Date(date.getFullYear(), date.getMonth() - 1, 32).getDate();
            
            const day = createDay(null, 32 - i);
            
            components.days.push(day);
            components.weeks.appendChild(day);
        }

        for(let i = 1; i <= days; i++) {
            const day = createDay(i, null);

            components.days.push(day);
            components.weeks.appendChild(day);
        }

        for (let i = 0; i < 42 - startingDay - days; i++) {
            const day = createDay(null, i);

            components.days.push(day);
            components.weeks.appendChild(day);
        }
    }

    const attachListeners = () => {
        components.monthBackButton.addEventListener('click', monthBack);
        components.monthNextButton.addEventListener('click', monthNext);
        components.yearBackButton.addEventListener('click', yearBack);
        components.yearNextButton.addEventListener('click', yearNext);
    }

    const init = (config) => {
        config = config || {};
        date = config.date || new Date();
        element = config.element || createElement();

        if(config.fn && typeof config.fn === 'function') {
            fn = config.fn;
        }

        if(config.classList) {
            if(config.classList.year) {
                classList.year = config.classList.year;
            }
    
            if(config.classList.yearBackButton) {
                classList.yearBackButton = config.classList.yearBackButton;
            }
    
            if(config.classList.yearNextButton) {
                classList.yearNextButton = config.classList.yearNextButton;
            }
    
            if(config.classList.month) {
                classList.month = config.classList.month;
            }
    
            if(config.classList.monthBackButton) {
                classList.monthBackButton = config.classList.monthBackButton;
            }
    
            if(config.classList.monthNextButton) {
                classList.monthNextButton = config.classList.monthNextButton;
            }

            if(config.classList.yearLabel) {
                classList.yearLabel = config.classList.yearLabel;
            }

            if(config.classList.monthLabel) {
                classList.monthLabel = config.classList.monthLabel;
            }
    
            if(config.classList.weeks) {
                classList.weeks = config.classList.weeks;
            }

            if(config.classList.dayWrapper) {
                classList.dayWrapper = config.classList.dayWrapper;
            }

            if(config.classList.day) {
                classList.day = config.classList.day;
            }
        }

        if(config.text) {
            if(config.text.back) {
                text.back = config.text.back;
            }
    
            if(config.text.next) {
                text.next = config.text.next;
            }
        }

        createViewComponents();
        attachListeners();
    }

    // Call the "constructor"
    init(config);

    // Public
    return {
        getDate: () => {
            return date;
        },

        getElement: () => {
            return element;
        }
    }
}