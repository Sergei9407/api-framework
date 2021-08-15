import CoreApi from '../src/http/CoreApi';
import { assert} from 'chai';
import { allure } from 'allure-mocha/runtime';
import Steps from '../src/steps/Steps';


const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1;


describe('Проверка функционала удаления случайного котика', async () => {
    before('Старт', () => {
        console.log('Старт первого тестирования функционала удаления случайного котика');
    });
    beforeEach(() => {
        console.log('Начало теста');
    });
    afterEach(() => {
        console.log('Завершение теста');
    });
    after(() => {
        console.log('Последний тест завершен');
    });




    it('Поиск  и удаление случайного кота', async () => {
        const notFoundStatus: number = 404;

        console.log("Получение списка котов");
        const allCatsResponse = await CoreApi.getAllCats();

        allure.logStep(`Выполнен запрос GET /get-all-cats`);
        allure.testAttachment(
            'testAttachment',
            JSON.stringify(allCatsResponse.data, null, 2),
            'application/json'
        );

        if (allCatsResponse.status === 404) {
            assert.fail(`Кот не найден! Response:\n ${JSON.stringify(allCatsResponse.data, null, 2)}`);
        }

        const randomGroup = getRandomInt(allCatsResponse.data.groups.length);
        const catId = allCatsResponse.data.groups[randomGroup].cats[getRandomInt(allCatsResponse.data.groups[randomGroup].cats.length)].id;
        console.log('Выбран случайный кот с ID %d ', catId);
        console.log('Удаление кота с ID %d ', catId);


        const removeResponse = await CoreApi.removeCat(catId);
        if (removeResponse.status === notFoundStatus) {
            assert.fail(`Кот не удален! Response:\n ${JSON.stringify(removeResponse.data, null, 2)}`);
        }
        else
            console.log('Кот с ID %d удален', catId);
        allure.logStep(`выполнен запрос DELETE  c параметром ${catId}`);
        allure.testAttachment(
            'testAttachment',
            JSON.stringify(removeResponse.data, null, 2),
            'application/json'
        );


        console.log('Проверка кота с  ID %d ', catId);
        const checkRemoveResponse = await CoreApi.getCatById(catId);

        allure.logStep(`выполнен запрос GET проверки  удаленного ктоа c параметром ${catId}`);
        allure.testAttachment(
            'testAttachment',
           "getCatById",
            'application/json'
        );


        if (checkRemoveResponse!==undefined)
        {
            if (checkRemoveResponse.status === 200)
        {
            assert.fail(`По результатам проверки кот не удален! Response:\n ${JSON.stringify(checkRemoveResponse.data, null, 2)}`);
        }
            if (checkRemoveResponse.status === notFoundStatus)
            {
                console.log('По результатам проверки кот удален!  ' );

            }
        }

    });

});