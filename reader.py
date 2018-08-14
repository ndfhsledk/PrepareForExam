import re
import codecs
def notEmpty(value):
	return value != None and len(value.strip())>0
def readQuestionAndAnswer(questionTxt,answerTxt):
	answerin = codecs.open(answerTxt,'r', 'utf-8')
	answerline = answerin.readline()
	answers = answerline.split(' ')
	answers = list(filter(notEmpty, answers))
	
	fin = codecs.open(questionTxt, encoding='UTF-8')
	
	allSingle = []
	curTmp = {}
	for line in fin:
		def pushNew(cur):
			if cur.get('question') != None:
				#print('q&a', cur)
				q_a = Q_A(cur.get('question'), cur.get('answers'))
				correctAnswer = answers.pop(0)
				acode, atext = code_text(correctAnswer)
				q_a["correctAnswer"] = atext
				allSingle.append(q_a)

		line = line.strip()
		if re.match('[0-9]', line) != None:
			# question part
			pushNew(curTmp)
			curTmp = {"question": line}
			continue
		if re.match('[A-Z]', line) != None:
			# answer part
			curTmp.setdefault('answers',[]).append(line)
	
	pushNew(curTmp)

	# test match
	if len(answers) > 0:
		print(len(answers))
		raise ValueError('Maybe answer is not match to question')
		
	return allSingle

def Q_A(questionStr, answerStrList):
	qcode, qtext = code_text(questionStr)
	result = {"no": qcode, "question": qtext}
	if answerStrList == None:
		return result
	result["answerList"]=[]
	for answerStr in answerStrList:
		acode, atext = code_text(answerStr)
		result["answerList"].append({"code": acode, "text": atext})
	return result

def code_text(line):
	dotIndex = line.find('.')
	code = line[0:dotIndex]
	code = code.strip()
	text = line[dotIndex+1:]
	text = text.strip()
	return (code, text)

files = [['singleChoice.txt', 'singleChoiceAnswer.txt', 'singleOut.txt'],
         ['multipleChoices.txt', 'multipleChoicesAnswer.txt', 'multipleOut.txt'],
         ['trueOrFalse.txt', 'trueOrFalseAnswer.txt', 'trueOrFalseOut.txt']]
import json
import codecs

#print(files)

for fileList in files:
        # print(fileList)
        arr = readQuestionAndAnswer(fileList[0], fileList[1])
        fout = codecs.open(fileList[2], 'w', 'utf-8')
        j= json.dumps(arr, ensure_ascii=False)
        fout.write(j)
        fout.close()



