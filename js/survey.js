$(document).ready(function() {
    const lMaxLength = 5; // Level 입력 최대값

    // 제출하기
    $('#submit').click(function(e) {
        e.preventDefault();
        let bFlag = ufn_validation();

        if (bFlag) {
            const response = getIpClient();

            if (response != false) {
                response.then((value) => {
                    $('#tempForm').remove();
                    let form = document.createElement("form");
                    
                    form.setAttribute("id", "tempForm");
                    form.setAttribute("charset", "UTF-8");
                    form.setAttribute("method", "Post");  //Post 방식
                    form.setAttribute("action", "/survey_submit"); //요청 보낼 주소

                    let ip = createInput('ip');
                    ip.setAttribute('value', value);
                    form.appendChild(ip);

                    let username = createInput('username');
                    username.setAttribute('value', $('#nickname').val());
                    form.appendChild(username);
                    
                    // discord nickname # discriminator
                    let val = '';
                    val = $('#discordNickname').val();
                    
                    let discordNickname = createInput('discordNickname');
                    discordNickname.setAttribute('value', val);
                    form.appendChild(discordNickname);
                    
                    let first = createInput('first');
                    first.setAttribute('value', val.split('#')[0]);
                    form.appendChild(first);

                    let discriminator = createInput('discriminator');
                    discriminator.setAttribute('value', val.split('#')[1]);
                    form.appendChild(discriminator);

                    let level = createInput('level');
                    level.setAttribute('value', $('#level').val());
                    form.appendChild(level);

                    let hobby1 = createInput('hobby1');
                    hobby1.setAttribute('value', $('#hobby1').val());
                    form.appendChild(hobby1);

                    let hobby2 = createInput('hobby2');
                    hobby2.setAttribute('value', $('#hobby2').val());
                    form.appendChild(hobby2);

                    let hobby3 = createInput('hobby3');
                    hobby3.setAttribute('value', $('#hobby3').val());
                    form.appendChild(hobby3);
                    
                    $('.radioDiv').each(function(index, value) {
                        let id = $(this).attr('id');

                        $(this).find('input[type=radio]').each(function(index2, value2) {
                            let chkFlag = $(this).is(':checked');
                            
                            if (chkFlag) {
                                let temp = createInput(id);
                                temp.setAttribute('value', $(this).val());
                                form.appendChild(temp);
                                return;
                            }
                        });
                    });

                    document.body.appendChild(form);
                    form.submit();
                });
            }
        }
    });

    function createInput(name) {
        let temp = document.createElement('input');
        temp.setAttribute('type', 'hidden');
        temp.setAttribute('name', name);

        return temp;
    }

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
        let bFlag = false;
        let bObj  = null;
        let result = $('.radioDiv').each(function(index, value) {
            let hFlag = false;

            $(this).find('input[type=radio]').each(function(index2, value2) {
                let chkFlag = $(this).is(':checked');
                
                if (chkFlag) {
                    hFlag = true;
                    return false;
                }
            });

            if (!hFlag) {
                $(this).attr('tabindex', -1).focus();
                ufn_showWarning('N');
                bFlag = true;
                return false;
            }
        });

        if (bFlag) {
            return false;
        } else {
            return true;
        }
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

$(window).bind("pageshow", function(event) {
    event.preventDefault();
    $('#tempForm').remove();
    $('#surveyForm')[0].reset(); 
});