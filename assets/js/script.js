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
    $scope.loading = true;
    $scope.editMode = true;

    $scope.employees = [
        {
            id: 0,
            name: 'Afolabi Tope Emmanuel',
            image: 'https://avatars0.githubusercontent.com/u/1?v=4',
            link: 'https://github.com/billiegate',
            position: 'Senior Dev',
            salary: 12000,
            job_description: 'Frontend Developer',
            status: 'Part time',
            duration: 2
        }
    ];

    $scope.employee = {
        name: '',
        position: '',
        image: 'https://avatars0.githubusercontent.com/u/1?v=4',
        salary: '',
        job_description: '',
        status: '',
        duration: '',
        retrieve: (em) => {
            $scope.employee.name = em.name;
            $scope.employee.position = em.position;
            $scope.employee.salary = em.salary;
            $scope.employee.job_description = em.job_description;
            $scope.employee.status = em.status;
            $scope.employee.duration = em.duration;
        }
    }

    $scope.errors = [];

    $scope.addEmployee = () => {
        if(!$scope.validateEmployee()) {
            return false;
        }
        $scope.createEmployee = !$scope.createEmployee;
        $scope.employee.id = $scope.employees.length + 1;
        if(!$scope.editMode){
            $scope.employees.push($scope.employee);
            //$scope.employee.reset();
        }
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
            } else {
                $scope.errors[x] = null;
            }
        }
        return isValid;
    }

    $scope.create = () => {
        $scope.editMode = false;
        $scope.createEmployee = !$scope.createEmployee;
    }

    $http.get('https://api.github.com/users').then( res => {
        let users = res.data.slice(0, 7);
        console.log(users);
        users.forEach( (user, i) => {
            $http.get(user.url).then( _user => {
                user.nurl = _user.data;
                $scope.employees.push(
                    {
                        id: user.id,
                        image: user.nurl.avatar_url,
                        link: user.nurl.html_url,
                        name: user.nurl.name,
                        position: user.nurl.company, //user.nurl.bio,
                        salary: parseInt(user.nurl.followers),
                        job_description: user.nurl.company,
                        status: new Date(new Date() - new Date(user.nurl.updated_at.split('T')[0])).getFullYear() - 1970 > 3 ? 'Part Time' : 'Full Time',
                        duration: new Date(new Date() - new Date(user.nurl.created_at.split('T')[0])).getFullYear() - 1970
                    }
                )
                if(i == 6) {
                    $scope.loading = false;
                }
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

    $scope.edit = function(el) {
        $scope.editMode = true;
        $scope.createEmployee = false;
        $scope.employee.retrieve(el);
        console.log($scope.employee);
    }

    
});