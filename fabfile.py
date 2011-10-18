#!/bin/env python
from fabric.api import local, run, env, cd
from ConfigParser import ConfigParser

usage = """
Usage (in the directory containing (%s) ...):
	
	fab [stage|run_staged|deploy|run_deployed]

DO NOT RUN THIS FILE (%s) AS A SCRIPT ON ITS OWN! 

	e.g. $ fab run_stage
""" % (__file__, __file__)


# DON'T TOUCH THESE
env.MY_NAME = ""
env.WIN_SHARED_DRIVE = ""
env.STAGING_DIR = "/staging/%s"
env.WIN_STAGING_DIR = "%s/%s"
env.HOST_STAGING_DIR = "$HOME/%s/%s"

env.hosts = ["kushu@kushu"]

def get_user_settings():
	conf = ConfigParser()
	if (conf.read("fabconfig") == []):
		while (env.MY_NAME == ""):
			env.MY_NAME = raw_input("What is your caplin username? ")
		env.WIN_SHARED_DRIVE = raw_input("What drive is the Kushu folder mounted on, e.g. E:, F:? [default: 'K:']")
		if not env.WIN_SHARED_DRIVE:
			env.WIN_SHARED_DRIVE = "K:"
	else:
		env.MY_NAME = conf.get("cred", "caplin_name")
		env.WIN_SHARED_DRIVE = conf.get("fs", "kushu_drive")
		env.STAGING_PORT = conf.get("cred", "staging_port")
	env.STAGING_DIR = env.STAGING_DIR % env.MY_NAME
	env.WIN_STAGING_DIR = env.WIN_STAGING_DIR % (env.WIN_SHARED_DRIVE, env.STAGING_DIR)
	env.HOST_STAGING_DIR = "/home/kushu%s" % env.STAGING_DIR

def stage():
	get_user_settings()
	local("cp -rpvf .*ignore app.js package.json public views %s" % env.WIN_STAGING_DIR)

	
def run_staged(port=None):
	get_user_settings()
	if port:
		env.STAGING_PORT = port
	with cd("%s" % env.HOST_STAGING_DIR):
		run("npm install -d")
		run("forever -w app.js %s" % (env.STAGING_PORT))

def deploy():
	print "NOTE: Only work submitted to Perforce is deployed to Kushu server!"
	run("p4 sync")

def run_deployed():
	run("cd ~/www && node app.js")
	
if __name__ == "__main__":
	print usage

