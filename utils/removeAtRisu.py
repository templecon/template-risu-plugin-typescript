import os
import re
replace=re.compile("import ?({.*}) ?from ?['\"]@risu/.*['\"];?")
for i in os.listdir("dist"):
    if i.endswith(".js"):
        with open(os.path.join("dist", i), "r") as f:    
            content = f.read()
        # remove import statements
        content = replace.sub("", content)
        # remove empty lines
        content = re.sub(r"\n\s*\n", "\n", content)
        
        with open(os.path.join("dist", i), "w") as f:
            f.write(content)
        print(f"Processed {i}")