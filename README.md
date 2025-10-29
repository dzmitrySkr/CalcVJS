### Задание:
1. #### Ссылка на задание
[Документ с заданием](https://docs.google.com/document/d/1zpXXeSae-BlcxPKgw3DhxZA92cspVailrPYoaXSYrW8/edit#heading=h.5dt3hghpa22f)  
    или  
*https://docs.google.com/document/d/1zpXXeSae-BlcxPKgw3DhxZA92cspVailrPYoaXSYrW8/edit#heading=h.5dt3hghpa22f*

2. #### Демо
[Посмотреть в браузере](https://calculatorvjs.netlify.app/)  
или  
*https://calculatorvjs.netlify.app/*

### Как запустить проект:
 - Склонируйте репозиторий: *git clone https://github.com/dzmitrySkr/CalcVJS.git*
 - Перейдите в папку проекта: *CalcVJS*
 - Установите зависимости: *npm install*
 - Запустите в режиме разработки: *npm start*
 - Для продакшн-сборки: *npm run build*
 - Итоговая сборка появится в папке dist/

### Краткое описание:

    Основные файлы проекта index.html, app.css, app.js utils.js

##### index.html
Основной файл с html-разметкой

##### app.js
Состоит из двух классов, класс **Calculator** является классом в котором происходят математические вычисления, проверки,
отображение вычислений. Класс **CalculatorUI** отвечает за связь разметки с JS - вешаются слушатели событий на кнопочки)

##### utils.js
Небольшой файл в котором лежат классы **Utils** облегчающие и уменьшающие написание кода.
Класс **_** наследуется от класса Utils для уменбшения кода.
