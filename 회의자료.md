4.18 컨트랙트 작성완료
~25 다 합치기
마스크 500개 => 1box로 정의 요기서 한개 두개로 하면 백엔드에서 *500개 처리함

0. 마스크 struct
	1. 구조체
		- 제조사에서 만들어준 SerialNum => timestamp
		- 제조사
		- 예상 유통사
		- 실제 유통사
		- 예상 판매사
		- 실제 판매사
	2. 마스크 생성시 제조사 와 serialNum 입력되어야함.
		- 파라미터 : SerialNum, 제조사ID
		- 변수 :
		- 컨트랙함수 : ~~createMask(string _SerialNum, string _makerId)~~ => startMaskMaking(), stopMaskMaking() 
		- 이벤트 : 마스크 구조체 생성
		- 기타 : 제조사에서 요 함수를 쓰면될듯
		
	3. SerialNum에 맞는 마스크 찾아서 리턴해줘야함.
		- 파라미터 : SerialNum
		- 변수 :
		>> - 컨트랙함수 : ~~getMaskInfo(string _SerialNum)~~ =>
				getMaskProductionDate(uint256 _index)
				getMaskProductionAddr(uint256 _index)
				getMaskQuantity(address _manufacturerAddr)
		- 이벤트 : ~~마스크 구조체 변수들 다 리턴해주기~~ =? 각각 함수별 리턴
		- 기타 : 
	
1. 제조사(maker)
	1. 구조체
	- ~~makerId(ex.001)~~ manufacturerName ~~첫째자리 0으로시작~~ string으로?
	- 일일 마스크 생산량 => uint256 maskAmountOutput
	- 보유중인 마스크 serialNum 배열 -> ~~재고량 배열크기로 체크하면될듯~~ 배열에 다 넣어야해서 비효율적일듯
		=> uint256 maskAmountHave 하루 생산 완료시마다 수량 늘려주는 변수
		=> maskIndex는 어떤 변수인지?
	
	2. 제조사 정보 리턴
		- 파라미터 : makerId,
		- 변수 :  
        	- 컨트랙함수 : ~~getMakerInfo(string makerId)~~ => getManufacturerName() 
	### 이부분 위에 3. SerialNum에 맞는 마스크 찾아서 리턴해줘야함. 과 다를게 무엇인지에 대한 고찰필요
        	- 이벤트 : 구조체 변수들 리턴
		- 기타 : 
		
	3. 1box 제조시 시리얼번호를 부여한다.(시리얼 = timestamp)
        	- 파라미터 : SerialNum(배열일 수 있음), 제조할 box개수,
		- 변수 :  
        	- 컨트랙함수 : ~~createMaskbox(string[] _SerialNumArray)~~ => startMaskMaking(uint256 _MaskQuantity)
       		- 이벤트 : 파라미터로 받은 배열의 SerialNum들과 makerId를 이용해 마스크구조체 생성, SerialNumArray들 마스크재고배열에 추가
		- 리턴 : 
		- 기타 : 웹에서 시리얼번호 쏴주기 => \\ __이거 고민해보기!__
        
	4. 박스 단위로 유통사와 계약한다.
		- 파라미터 : 마스크 시리얼넘버 배열 \\ __배열이 너무 커질것 회의 필요__ , 계약할 유통사, 계약할 box 개수
        	- 변수 : 
        	- 컨트랙함수 : manufacturerToDealer(string[] _SerialNumArray, string dealerID)
        	- 이벤트 : 마스크 구조체에 예상 유통사 추가하고 제조사 마스크재고배열에서 SerialNumArray들 뺀다.
		- 리턴 : SerialNumArray 리턴해야할듯.
        
	5. ~~(보류) 유통사로 물류 이동과정을 명시한다. (택배 추적 시스템)//??(잘 모르겠음)~~
        	- 변수 : 운송장번호, 개수
        	- 컨트랙함수 : 
        	- 이벤트 : 


2. 유통사(dealer)
	1. 구조체
		- dealerId(ex.10A) 첫째자리 1로 시작 - __string dealerId__
		- 일일 마스크 수입량(이것도 고민중)
		- 소유중인 마스크 serialNum 배열

	2. 유통사 정보 리턴
		- 파라미터 : dealerId,
		- 변수 :  
        	- 컨트랙함수 : ~~getdealerInfo(string dealerId)~~ => __getDealerName()__
        	- 이벤트 :
		- 기타 : 
	3. ~~제조사로부터 납품받은 마스크 처리~~ __자동으로 구조체 개수에 추가시킴__
		~~- 파라미터 : SerialNumArray
        	~~- 변수 : 
        	~~- 컨트랙함수 : addMaskBox(string[] SerialNumArray)
        	~~- 이벤트 : SerialNumArray를 마스크 재고 배열에 추가~~
	4. 박스 단위로 판매점에 납품
		- 파라미터 : 마스크 serialNum 배열, 계약할 판매사, 계약할 box 개수
        	- 변수 : 
        	- 컨트랙함수 : contractToseller(string[] _SerialNumArray, string dealerId)
        	- 이벤트 : ~~마스크 구조체에 계약할 판매사 ID를 예상 판매사에 넣어주고 SerialNumArray들 마스크재고배열에서 삭제.~~ __배열로 해야하는데 배열로 하면 크기가 너무 커질수 있을거같아서 해결책 필요

    
3. 판매사(seller)
	1. 구조체
		- sellerId(ex.20A) 첫째자리 2로시작
		- 일일 마스크 수입량(이것또한)
		- 소유중인 마스크 serialNum배열
		- 마스크 serialNum별 재고량(여기서는 들어온 박스 곱하기 500해서 표시하고 serialNum별로 재고체크하는게 어떨까)
			123412424152 - 500
			125125151251 - 499
	
	
	2. 판매사 정보 리턴
		- 파라미터 : sellerId,
		- 변수 :  
        	- 컨트랙함수 : getsellerInfo(string sellerId)
        	- 이벤트 : 
		- 기타 : 
	3. 납품받은 박스들 처리
		- 파라미터 : SerialNumArray
        	- 변수 : 
        	- 컨트랙함수 : addMask(string[] SerialNumArray)
        	- 이벤트 : SerialNumArray를 마스크 재고 배열에 추가(이 함수는 유통사랑 같이써도될듯)
	
	4. 판매
		- 파라미터 : serialNum
		- 변수 :  
        	- 컨트랙함수 : sellMask(string serialNum)
        	- 이벤트 : serialNum에 해당하는 배열 재고량 -1 
		- 기타 : 

추가 필요한 함수들 : 
1. 실제, 예상 비교
2. 법적근거 체크

============================================


v1.3 (04.22)
0. 마스크
	1. 구조체
		- 제조사 이름 (string)
		- 제조사 주소 (address)
		- 생산 날짜 (date)
		
	2. 마스크 생성시 제조사 이름과 컨트렉트 소유자 address가 들어감
		- 파라미터 : name, account
		- 변수 :
		- 컨트랙함수 : maskMaking() 
		- 이벤트 : 
		- 기타 : 새로운 마스크 생산 (토큰 발행 _mint)
		
	3. ERC721로 관리하기 때문에 tokenId = maskId
		- 파라미터 : 
		- 변수 :
		- 컨트랙함수 : 
		- 이벤트 : ~~마스크 구조체 변수들 다 리턴해주기~~ =? 각각 함수별 리턴
			function return name
			function return address
			function return date .. 이렇게..?
		- 기타 : Masks[maskId] => 마스크 구조체 내부 변수 확인가능
		
1. 제조사(maker)
	1. 제조사 정보 리턴
		- 파라미터 :
		- 변수 :  
        	- 컨트랙함수 :
	### 이부분 위에 3. SerialNum에 맞는 마스크 찾아서 리턴해줘야함. 과 다를게 무엇인지에 대한 고찰필요
	=> tokenId에 맞는 마스크 찾아서 리턴? (Masks[maskId])
        	- 이벤트 : 
		- 기타 : 
			- 일일 마스크 생산량 => uint256 maskAmountOutput (하루 단위를 어떻게 계산해야 되는지 고민중)
			- 보유중인 마스크 = balanceOf()
        
	2. 박스 단위로 유통사와 계약한다.
		- 파라미터 : from (제조사가 될 수도 있고, 유통사가 될 수도 있음), to (유통사가 될 수도 있고, 판매사가 될 수도 있음),
				maskId(어떤 박스를 계약할 것인지), price
        	- 변수 : 
        	- 컨트랙함수 : startMaskDeal()
        	- 이벤트 : 계약정보(dealInfo)를 추가하고, 마스크 박스를 to로 넘긴다. (Transfer)
		
2. 유통사(dealer)
	1. 구조체 dealInfo -> 유통사에 대한 정보가 아니라 유통(계약)에 대한 정보가 담긴 구조체
		- expDealer 예상 유통지
		- realDealer 실제 유통지
		- price 가격
		- date 계약 날짜

	2. 유통사 정보 리턴
		- 파라미터 :
		- 변수 :  
        	- 컨트랙함수 : getDealInfo()
        	- 이벤트 : 계약에 대한 정보를 보여준다.
		- 기타 : 계약 정보가 구조체, 배열로 구성되어 있어서 어떻게 해야할지 모르겠음 (배열, 구조체 반환이 불가)
		
	3. 박스 단위로 유통사 or 판매사에 납품
		- 파라미터 : 마스크 serialNum 배열, 계약할 판매사, 계약할 box 개수
        	- 변수 : 
        	- 컨트랙함수 : startMaskDeal()
        	- 이벤트 : 유통사와 판매사 사이의 계약 함수를 또 만들 필요 없이 startMaskDeal로 마스크 박스 납품
		
	4. 예상 유통지, 실제 유통지 비교
		- 파라미터 : 유통지의 address, 마스크 식별자 (maskId)
		- 변수 : length (계약마다 계약정보가 배열 마지막에 append 되기 때문에 배열 끝부분 참조를 위함)
		- 컨트랙함수 : stopMaskDeal()
		- 이벤트 : 마스크를 납품받은 유통지는 제조사에서 납품할 때 기록한 예상 유통지의 주소와 자신의 주소를 비교한다.
		- 기타 : 제조사가 기록한 예상 유통지와 실제 유통지가 일치하면 계약정보에 실제 유통지 정보를 기록
		
		
		
		
===================================

-TestRPC : 개발 진행
-TestNet : 개발 완료 후 MainNet과 동일한 환경에서 테스트
-MainNet : 실제 서비스에 사용할 수 있도록 배포
