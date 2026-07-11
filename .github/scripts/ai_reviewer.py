import os
import subprocess
import requests
from google import genai

# 1. Environment Setup (Injected by GitHub Actions)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_REPOSITORY = os.environ.get("GITHUB_REPOSITORY") # e.g., "user/repo"
COMMIT_SHA = os.environ.get("GITHUB_SHA")

# Initialize the new SDK client
client = genai.Client(api_key=GEMINI_API_KEY)

def get_git_diff():
    """Fetches the diff between the current push and the previous commit."""
    try:
        # fetch-depth: 2 in the workflow ensures HEAD~1 exists
        result = subprocess.run(
            ['git', 'diff', 'HEAD~1', 'HEAD'], 
            capture_output=True, text=True, check=True
        )
        return result.stdout
    except subprocess.CalledProcessError:
        print("Could not generate diff (might be the first commit or force push).")
        return ""

def generate_review(diff):
    if not diff.strip():
        return None

    # ---------------------------------------------------------
    # YOUR CUSTOM RULES GO HERE
    # ---------------------------------------------------------
    custom_rules = """
    1. [Define your first rule here, e.g., "Enforce early returns instead of nested if-statements."]
    2. [Define your second rule here, e.g., "Ensure no database calls are made inside loops."]
    """

    prompt = f"""
    You are an expert code reviewer. Review the following git diff.

    ### USER-DEFINED RULES
    You must strictly obey the following rules during your review:
    {custom_rules}

    ### CORE INSTRUCTIONS
    1. **Explain the Modifications:** You MUST explain the reason and logic behind every part of the code you suggest modifying. 
    2. **Architecture Focus:** Evaluate the code specifically for long-term maintainability and scalability.
    3. **Preserve Flow:** Your suggestions must NOT alter the original execution flow or business logic of the code.
    4. **Format:** Output your review in clean Markdown. Reference specific filenames and line numbers from the diff.

    ### GIT DIFF
    ```diff
    {diff}
    ```
    """
    
    # Call the model via the new client instance
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text

def post_commit_comment(review_text):
    """Posts the review directly to the GitHub commit."""
    if not review_text:
        return
        
    url = f"https://api.github.com/repos/{GITHUB_REPOSITORY}/commits/{COMMIT_SHA}/comments"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    
    body = f"🤖 **AI Code Review (Triggered by Push)**\n\n{review_text}"
    
    response = requests.post(url, headers=headers, json={"body": body})
    
    if response.status_code == 201:
        print("Successfully posted review to GitHub.")
    else:
        print(f"Failed to post comment: {response.text}")
        response.raise_for_status()

if __name__ == "__main__":
    diff_text = get_git_diff()
    if diff_text:
        review = generate_review(diff_text)
        post_commit_comment(review)
    else:
        print("No code changes detected to review.")