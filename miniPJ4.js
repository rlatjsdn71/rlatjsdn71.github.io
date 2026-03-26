//전역 함수 선언
let products;
let cart = [];

// list 내용 출력 및 highlight 내용 하이라이트 *호출처: reset_cards() 함수, 검색 이벤트
function display_cards(list, highlight = [], hl_len = 0) { // list: 출력할 내용, highlight: 하이라이트 입힐 내용(위치), hl_len: 하이라이트 입힐 길이
    let container = $('.card-container');
    if (highlight.length == 0) // 하이라이트 없는 경우
        list.forEach(function (a, i) {
            container.append(`
            <div class="card me-3" draggable= "true">
                <img src="./img/${products[a].photo}" class="mt-3" alt="..." draggable= "false">
                <div class="card-body">
                    <h4 class="card-title mb-1">${products[a].title}</h4>
                    <p class="card-text mb-1">${products[a].brand}</p>
                    <h5 class="card-text mb-3">${products[a].price}원</h5>
                    <button type="button" class="btn btn-dark" data-btn = "${a}">담기</button>
                </div>
            </div>
            `);
        });
    else // 하이라이트가 있는 경우
        list.forEach(function (a, i) {
            let title_hl = `${products[a].title}`
            let brand_hl = `${products[a].brand}`

            // 제품 이름에 하이라이트가 있는 경우
            if (highlight[i].title != -1)
                title_hl =
                    `${products[a].title.substr(0, highlight[i].title)}`
                    + `<span style="background : yellow">${products[a].title.substr(highlight[i].title, hl_len)}</span>`
                    + `${products[a].title.substr(highlight[i].title + hl_len)}`

            // 브랜드 이름에 하이라이트가 있는 경우
            if (highlight[i].brand != -1)
                brand_hl =
                    `${products[a].brand.substr(0, highlight[i].brand)}`
                    + `<span style="background : yellow">${products[a].brand.substr(highlight[i].brand, hl_len)}</span>`
                    + `${products[a].brand.substr(highlight[i].brand + hl_len)}`
            // 깔끔하게 보이려고 더하기로 처리(그냥 줄바꿈하면 결과에 띄어쓰기 포함됨)

            container.append(`
            <div class="card me-3" draggable= "true">
                <img src="./img/${products[a].photo}" class="mt-3" alt="..." draggable= "false">
                <div class="card-body">
                    <h4 class="card-title mb-1">${title_hl}</h4>
                    <p class="card-text mb-1">${brand_hl}</p>
                    <h5 class="card-text mb-3">${products[a].price}원</h5>
                    <button type="button" class="btn btn-dark" data-btn = "${a}">담기</button>
                </div>
            </div>
            `);
        });
}
// 카드 내용 클리어 함수 *호출처: reset_cards() 함수, 검색 이벤트
function clear_cards() {
    $('.card-container').html('');
}

// 카드 내용 초기화 함수 (모든 제품 출력) *호출처: 시작 시(ajax), 검색 이벤트
function reset_cards() {
    let temp = [];
    for (let i = 0; i < products.length; i++)
        temp.push(i);
    clear_cards();
    display_cards(temp);
}

//카트 출력 *호출처: add_cart() 함수, 카트 카드 수량 입력 이벤트
function display_cart() { 
    let container = $('.cart');
    let empty = true;
    container.html('');
    cart.forEach(function (a, i) {
        if (a == 0) return; // 값이 0이면(개수가 0이면) 출력 안함
        container.append(`
                <div class="card cart-card me-2">
                    <img src="./img/${products[i].photo}" class="mt-3" alt="..." draggable = "false">
                    <div class="card-body">
                        <h4 class="card-title mb-1">${products[i].title}</h4>
                        <p class="card-text mb-1">${products[i].brand}</p>
                        <h5 class="card-text mb-3">${products[i].price}원</h5>
                        <input type="text" value=${a} data-input = "${i}">
                    </div>
                </div>
                `);
        empty = false;
    })
    if (empty)
        container.append('<p>여기로 드래그</p>'); // 출력이 없다면 초기 화면으로
    display_footer(empty); // footer 출력
}

// 카트에 카드 추가 함수 *호출처: 담기 버튼 이벤트, drop 이벤트
function add_cart(card) { 
    cart[card]++;
    display_cart();
}

// footer 출력 함수 *호출처: display_cart() 함수, 카트 카드 수량 입력 이벤트
function display_footer(empty = false) {
    if (empty) { // 카트에 아무것도 없다면 출력 안함
        $('.footer').css('display', 'none');
        return;
    }
    $('.footer').css('display', 'block');
    $('.footer p').html(`합게: ${sum_price()}원`);
}

// 총 상품 수 및 가격 반환 함수 *호출처: display_cart() 함수, display_canvas() 함수
function sum_price() {
    let sum = 0;
    cart.forEach(function (a, i) {
        sum += a * products[i].price;
    });
    return sum;
}

// 캔버스 내용 입력 함수 *호출처: 입력완료(캔버스 출력) 이벤트
function display_canvas() { 
    let canvas = document.querySelector('.canvas');
    let c = canvas.getContext('2d');
    let data = new Date();
    let height = 200;
    c.font = '50px dotum';
    c.fillText('영수증', 50, 100);
    c.font = '20px dotum';
    c.fillText(`${data.getFullYear()}-${data.getMonth()}-${data.getDay()} ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`, 50, 150);
    c.font = '15px dotum';

    cart.forEach(function (a, i) {
        if (a == 0) return;
        c.fillText(`품명: ${products[i].title}`, 50, height);
        height += 15;
        c.fillText(`개 당 가격: ${products[i].price}원`, 50, height);
        height += 15;
        c.fillText(`수량: ${a}`, 50, height);
        height += 75;
    })

    c.font = '20px dotum';
    c.fillText(`총액: ${sum_price()}원`, 50, 650);

    $('.canvas-container').css('visibility', 'visible');
}

//이상 함수 구문
//이하 이벤트 구문

// 시작 시 카드 상자, 카트 초기화
$.get('./miniPJ4.json').done(function (data) {
    products = data.products // 데이터 읽기
    for (i = 0; i < products.length; i++) cart.push(0); // 카트 초기화
    reset_cards(); // 카트 상자 초기화
});

// 검색 기능
$('#search-box').on('input', function () { // search-box 요소가 변할 때마다 이벤트 발생
    let search = this.value;
    let res_list = []; // 결과 배열
    let highlight = []; // 하이라트 배열
    if (search.length > 1) // 검색은 2글자 이상부터
        products.forEach(function (a) {
            let title_idx = a.title.indexOf(search);
            let brand_idx = a.brand.indexOf(search);
            if (title_idx == -1 && brand_idx == -1) return; // 결과가 없으면 반환
            res_list.push(a.id); // 결과가 있으면 결과 배열에 추가 후,
            highlight.push({ 'title': title_idx, 'brand': brand_idx }); // 하이라트 배열에 하이라이트 위치(인덱스) 주가
        });

    if (res_list.length == 0) { // 검색 결과 없으면 모든 제품 출력
        reset_cards();
        return;
    };
    clear_cards();
    display_cards(res_list, highlight, search.length);
});

// 카트 담기 버튼 이벤트(이벤트 버블링 이용)
$('.card-container').click(function (e) {
    add_cart(e.target.dataset.btn); // 카드 생성 시 버튼에 부여한 번호 사용
});


// 드래그앤드랍 처리
$('.card-container').on('dragstart', function (e) { // 드래그 시작(드래그되는 요소에 이벤트 리스너 추가)
    e.originalEvent.dataTransfer.setData('data', e.target.querySelector('button').dataset.btn);
    // dataTransfer.setData를 이용해서 값 전달 *(jquery 이벤트 리스너 안에서는 originalEvent를 붙여 기존의 함수들을 사용할 수 있음)
});

$('.cart').on('dragover', function (e) { // 이 이벤트 없으면 드랍 이벤트가 발생이 안된다고 함 (도착 목표 요소에 이벤트 리스너 추가)
    e.preventDefault(); // 이 함수도 없으면 안된다고 함
});

$('.cart').on('drop', function (e) { // 드랍이벤트 (목표 요소에 리스너 추가)
    e.preventDefault(); // 마찬가지로 추가
    add_cart(e.originalEvent.dataTransfer.getData('data')); // 기존 만든 함수로 처리
    // dataTransfer.getData 함수로 위에서 설정한 값을 불러오기 *(마찬가지로 jquery 이벤트 리스너 안이므로 originalEvent 사용)
});

// 카트 카드 input에 입력이 들어온 경우 이벤트 처리
$('.cart').on('change', function (e) {
    let target = e.target.dataset.input; // 카트 카드 생성 시 텍스트 박스에 부여한 번호 사용
    let val = e.target.value; // 값 읽어오기

    if (!/^[0-9]+$/.test(val)) { // 서식 확인 (0이상의 정수가 맞는지)
        e.target.value = cart[target];
        return;
    }

    val = parseInt(val); // 값 정수화
    e.target.value = val; // 인풋 상자 내용 최신화
    cart[target] = val; // cart 최신화

    if (val == 0) { // 값이 0이라면 카트 출력 최신화(삭제 처리)
        display_cart();
        return;
    }

    display_footer(); // footer 출력 최신화
});

// 구매하기 버튼누르면 모달 뜸
$('.footer button').click(function () {
    $('.black-bg').css('visibility', 'visible');
});

// 모달 내 닫기 버튼
$('.black-bg #close').click(function () {
    $('.black-bg').css('visibility', 'hidden');
    $('.black-bg input').val(''); // 기존 입력 내용 삭제
});

// 모달 내 입력완료 버튼
$('.black-bg #submit').click(function () {
    let name = $('.black-bg input').eq(0).val();
    let phone = $('.black-bg input').eq(1).val();
    if (!/^[가-힣]{2,}$/.test(name) || !/^[0-9]{2,}$/.test(phone)) { // 서식 검사
        alert('입력 서식 확인해주세용~');
        return;
    }
    display_canvas(); // 영수증 출력
});

// 완료하면 모든 화면 초기화(새로고침)
$('.canvas-container button').click(function () {
    location.reload(true); // 새로고침
})
