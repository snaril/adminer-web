git config --global user.name "snaril"
git config --global user.email "snariler@163.com"
git add .
git commit -m "vue+vite init_login"
git remote add origin git@gitee.com:snaril/web-admin.git
git push -u origin "master"

[
    git remote add origin git@gitee.com:snaril/web-admin.git -> off err : fatal: remote origin already exists.

    {
        git remote rm origin
        git remote add origin git@gitee.com:snaril/web-admin.git
        git add .
    }
    
]