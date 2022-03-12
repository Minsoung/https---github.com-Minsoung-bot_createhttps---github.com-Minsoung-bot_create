$(document).ready(function() {
    const lMaxLength = 5; // Level 입력 최대값

    // 제출하기
    $('#submit').click(function(e) {
        e.preventDefault();
        let bFlag = ufn_validation();

        if (!bFlag) {
            const response = getIpClient();

            if (response != false) {
                response.then((value) => {
                    var form = document.createElement("form");
                    
                    form.setAttribute("charset", "UTF-8");
                    form.setAttribute("method", "Post");  //Post 방식
                    form.setAttribute("action", "/survey_submit"); //요청 보낼 주소

                    console.log(form);
                    document.body.appendChild(form);
                    form.submit();
                });
            }
        }
    });

    // 유효성 검증
    function ufn_validation() {
        // 게임 닉네임
        if (gfn_isNull($('#nickname').val())) {
            $('#nickname').focus();
            ufn_showWarning('N');
            return false;
        }

        // 디스코드 닉네임
        let discordNicknameObj = $('#discordNickname');
        let discordNicknameVal = discordNicknameObj.val();
        if (gfn_isNull(discordNicknameVal)) {
            discordNicknameObj.focus();
            ufn_showWarning('N');
            return false;
        } else {
            // 디스코드 닉네임 형식 체크
            const expr = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+#[0-9]{4,4}$/;
            if (!expr.test(discordNicknameVal)) {
                discordNicknameObj.focus();
                ufn_showWarning('M', '형식에 맞게 입력해주세요. ex) ○○○#0000');
                return false;
            }
        }

        // 레벨
        let levelObj = $('#level');
        let levelVal = $('#level').val();
        if (gfn_isNull(levelVal)) {
            levelObj.focus();
            ufn_showWarning('N');
            return false;
        } else {
            // 레벨 숫자 체크
            if (isNaN(levelVal)) {
                levelObj.focus();
                ufn_showWarning('M', '숫자만 입력해 주세요.');
                return false;
            }
        }

        // 라디오 체크 여부 확인
        let result = $('.radioDiv').each(function(value, index) {
            let bFlag = false;

            $(this).find('input[type=radio]').each(function(value2, index2) {
                let chkFlag = $(this).is(':checked');

                if (chkFlag) {
                    bFlag = true;
                    return false;
                }
            });

            if (!bFlag) {
                $(this).attr('tabindex', -1).focus();
                return false;
            }
        });

        return true;
    }

    // 경고 메세지 출력
    function ufn_showWarning(type, Ex) {
        if (type == "N") {
            alert("필수 값을 입력해 주세요.");
        } else if (type == "M") {
            alert(Ex);
        }
    }

    // 레벨 입력 길이 제한 (현재 len = 5)
    $("#level").on("propertychange change keyup paste input", function() {
        let value = $(this).val();
        
        if (value.length > lMaxLength) {
            $(this).val(value.substr(0, lMaxLength));
        }
    });

    // 클라이언트 IP 획득
    async function getIpClient() {
        try {
          const response = await axios.get('https://api.ipify.org?format=json');
          let ip = response.data.ip;
          return ip;
        } catch (error) {
          return false;
        }
    }

    gfn_isNull = function(value) {
        if (value == 'undefined' || value == "" || value == null || value == undefined || value == "null") {
            return true;
        }
    
        return false;
    }
});