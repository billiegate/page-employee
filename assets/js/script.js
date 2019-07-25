var app = angular.module('app', ['ngAnimate']);
app.controller('navController', function($scope){
    $scope.activeNav = 0;
    $scope.activeTab = 0;
    $scope.navs = [
        {
            name: 'project',
            menus: [
                {name: 'Arena Sport', icon: ''},
                {name: 'DSV', icon: ''},
                {name: 'Seefood Mall', icon: ''},
                {name: 'Firestar', icon: ''},
                {name: 'Zeta Bank', icon: ''},
            ],
        },
        {
            name: 'status',
            menus: [
                {name: 'Full Time', icon: ''},
                {name: 'Part Time', icon: ''},
            ]
        }
        
    ]
    $scope.tabs = ['Calender', 'Statistic', 'Employee', 'Client', 'Equipment'];
    $scope.changeTab = tab => {
        $scope.activeTab = tab;
    }
});

app.controller('employeeController', function($scope, $http){

    $scope.createEmployee = true;

    $scope.employees = [
        {
            id: 0,
            name: 'Afolabi Tope Emmanuel',
            position: 'Senior Dev',
            salary: '300k',
            job_description: 'Frontend Developer',
            status: 'Part time',
            duration: '2yrs'
        }
    ];

    $scope.employee = {
        name: '',
        position: '',
        salary: '',
        job_description: '',
        status: '',
        duration: ''
    }

    $scope.errors = [];

    $scope.addEmployee = () => {
        if(!$scope.validateEmployee()) {
            return false;
        }
        $scope.employee.id = $scope.employees.length + 1;
        $scope.employees.push($scope.employee);
        console.log($scope.employees);
    }

    $scope.remove = (employee) => {
        $scope.employees = $scope.employees.filter( _employee => {
            return _employee.id != employee.id
        })
    }

    $scope.validateEmployee = () => {
        let isValid = true;
        for(var x in $scope.employee){
            if( !$scope.employee[x] ) {
                isValid = false;
                $scope.errors[x] = x.split('_').join(' ') + ' is required'; 
            }
        }
        return isValid;
    }

    $scope.create = view => {
        console.log(view);
        $scope.createEmployee = !$scope.createEmployee;
    }

    $http.get('https://api.github.com/users').then( res => {
        let users = res.data.slice(0, 7);
        users.forEach( (user, i) => {
            $http.get(user.url).then( _user => {
                user.nurl = _user.data;
                $scope.employees.push(
                    {
                        id: user.id,
                        name: user.nurl.name,
                        position: user.nurl.company, //user.nurl.bio,
                        salary: user.nurl.followers,
                        job_description: user.nurl.company,
                        status: new Date(new Date() - new Date(user.nurl.updated_at.split('T')[0])).getFullYear() - 1970 > 3 ? 'Part Time' : 'Full Time',
                        duration: new Date(new Date() - new Date(user.nurl.created_at.split('T')[0])).getFullYear() - 1970 + 'yrs'
                    }
                )
            });
        
            // $scope.employees = users.map( (user) => {
                // return {
                //     name: user.nurl.name,
                //     position: user.nurl.bio,
                //     salary: user.nurl.follower,
                //     job_description: user.nurl.company,
                //     status: new Date(new Date() - new Date(user.nurl.updated_at.split('T')[0])).getFullYear() - 1970 > 3 ? 'Part Time' : 'Full Time',
                //     duration: new Date(new Date() - new Date(user.nurl.created_at.split('T')[0])).getFullYear() - 1970
                // }
            // })
        });
        
    });

    
});